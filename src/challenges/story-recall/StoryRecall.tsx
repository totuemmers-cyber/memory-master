import { useState, useCallback, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import type { StoryQuestion } from './story-templates';
import { getDifficultyConfig } from './difficulty-config';
import { buildStory } from './story-templates';
import { CountdownOverlay } from '../../challenges/observation-chamber/CountdownOverlay';
import { TimerBar } from '../../challenges/observation-chamber/TimerBar';
import { PixelButton } from '../../components/ui/PixelButton';
import { PixelProgress } from '../../components/ui/PixelProgress';
import { useTimer } from '../../hooks/useTimer';
import { useSound } from '../../hooks/useSound';
import { calculateScore, getScoreLabel } from '../../engine/scoring';
import { calculateNewDifficulty } from '../../engine/adaptive-difficulty';
import { useGameStore } from '../../state/game-store';
import { cn } from '../../utils/cn';

type Phase = 'idle' | 'countdown' | 'reading' | 'questions' | 'results';

interface AnsweredQ {
  question: StoryQuestion;
  playerAnswer: string;
  isCorrect: boolean;
}

export function StoryRecall({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [storyText, setStoryText] = useState('');
  const [questions, setQuestions] = useState<StoryQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answered, setAnswered] = useState<AnsweredQ[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [numberValue, setNumberValue] = useState('');
  const [countdownValue, setCountdownValue] = useState(3);
  const [score, setScore] = useState(0);
  const [difficultyChange, setDifficultyChange] = useState<'up' | 'down' | 'stable'>('stable');
  const startTimeRef = useRef(0);
  const sound = useSound();

  const config = getDifficultyConfig(difficulty);
  const viewDurationMs = config.viewingTime * 1000;

  const viewTimer = useTimer({
    durationMs: viewDurationMs,
    onComplete: useCallback(() => {
      setPhase('questions');
      setCurrentQIndex(0);
    }, []),
  });

  const startRound = useCallback(() => {
    const story = buildStory(config.sentenceCount, config.questionCount);
    setStoryText(story.sentences.join(' '));
    setQuestions(story.questions);
    setAnswered([]);
    setFeedback(null);
    setNumberValue('');
    setScore(0);
    setDifficultyChange('stable');

    setPhase('countdown');
    setCountdownValue(3);
    sound.playCountdown();

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownValue(count);
        sound.playCountdown();
      } else {
        clearInterval(interval);
        setPhase('reading');
        viewTimer.start();
        sound.playStart();
        startTimeRef.current = performance.now();
      }
    }, 1000);
  }, [config, sound, viewTimer]);

  const handleAnswer = useCallback((answer: string) => {
    const q = questions[currentQIndex];
    const isCorrect = answer === q.correctAnswer;

    if (isCorrect) sound.playCorrect();
    else sound.playWrong();

    const aq: AnsweredQ = { question: q, playerAnswer: answer, isCorrect };
    setFeedback({ isCorrect, correctAnswer: q.correctAnswer });
    setAnswered(prev => [...prev, aq]);

    setTimeout(() => {
      setFeedback(null);
      setNumberValue('');
      const nextIndex = currentQIndex + 1;
      if (nextIndex >= questions.length) {
        const allAnswered = [...answered, aq];
        const correct = allAnswered.filter(a => a.isCorrect).length;
        const finalScore = calculateScore(correct, allAnswered.length);
        setScore(finalScore);

        const categoryHistory = useGameStore.getState().profile.categoryHistory['narrative'] || [];
        const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
        const { reason } = calculateNewDifficulty(difficulty, withNew);
        setDifficultyChange(reason);

        setPhase('results');

        onComplete({
          challengeId: 'story-recall',
          difficulty,
          score: finalScore,
          accuracy: correct / allAnswered.length,
          totalQuestions: allAnswered.length,
          correctAnswers: correct,
          timeUsed: performance.now() - startTimeRef.current,
          timeAllowed: viewDurationMs,
          timestamp: Date.now(),
        });
      } else {
        setCurrentQIndex(nextIndex);
      }
    }, 1200);
  }, [questions, currentQIndex, answered, difficulty, viewDurationMs, onComplete, sound]);

  // IDLE
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Story Recall</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Read the story carefully. Then answer questions about the details.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">{config.sentenceCount} sentences — {config.questionCount} questions — {config.viewingTime}s</span>
        </div>
        <div className="flex gap-3">
          <PixelButton variant="secondary" onClick={onQuit}>Cancel</PixelButton>
          <PixelButton variant="primary" size="lg" onClick={startRound}>Start</PixelButton>
        </div>
      </div>
    );
  }

  if (phase === 'countdown') return <CountdownOverlay value={countdownValue} />;

  // READING
  if (phase === 'reading') {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <TimerBar totalMs={viewDurationMs} remainingMs={viewTimer.remainingMs} />
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-4 text-center">Read carefully</div>
        <div className="bg-pixel-surface p-6 pixel-border-muted">
          <p className="challenge-zone text-base text-gray-200 leading-relaxed">{storyText}</p>
        </div>
      </div>
    );
  }

  // QUESTIONS
  if (phase === 'questions' && questions[currentQIndex]) {
    const q = questions[currentQIndex];
    return (
      <div className="p-6 max-w-lg mx-auto challenge-zone">
        <div className="text-pixel-muted text-pixel-xs mb-6 text-center font-pixel">
          Question {currentQIndex + 1} / {questions.length}
        </div>
        <h3 className="text-lg font-medium text-white mb-8 text-center leading-relaxed">{q.text}</h3>

        {q.type === 'multipleChoice' && q.options && (
          <div className="flex flex-col gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => !feedback && handleAnswer(option)}
                disabled={!!feedback}
                className={cn(
                  'w-full py-3 px-4 text-left rounded-lg border-2 transition-all text-base',
                  feedback
                    ? option === feedback.correctAnswer
                      ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                      : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                    : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold cursor-pointer'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {q.type === 'yesNo' && (
          <div className="flex gap-4 justify-center">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                onClick={() => !feedback && handleAnswer(opt)}
                disabled={!!feedback}
                className={cn(
                  'px-8 py-3 rounded-lg border-2 transition-all text-base font-medium min-w-[100px]',
                  feedback
                    ? opt === feedback.correctAnswer
                      ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                      : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                    : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold cursor-pointer'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === 'numberInput' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumberValue(v => String(Math.max(q.min || 0, (parseInt(v) || 0) - 1)))}
                disabled={!!feedback}
                className="w-10 h-10 bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg text-xl hover:border-pixel-gold disabled:opacity-50"
              >-</button>
              <input
                type="number"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && numberValue && !feedback) handleAnswer(numberValue); }}
                disabled={!!feedback}
                className="w-20 h-12 text-center text-xl bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg focus:border-pixel-gold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setNumberValue(v => String(Math.min(q.max || 999, (parseInt(v) || 0) + 1)))}
                disabled={!!feedback}
                className="w-10 h-10 bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg text-xl hover:border-pixel-gold disabled:opacity-50"
              >+</button>
            </div>
            {!feedback && (
              <button
                onClick={() => numberValue && handleAnswer(numberValue)}
                disabled={!numberValue}
                className="px-6 py-2 bg-pixel-gold text-pixel-dark font-pixel text-pixel-sm rounded-lg hover:bg-pixel-gold/90 disabled:opacity-50"
              >Confirm</button>
            )}
          </div>
        )}

        {feedback && (
          <div className={cn('mt-6 text-center font-pixel text-pixel-sm', feedback.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red')}>
            {feedback.isCorrect ? 'Correct!' : `Wrong! Answer: ${feedback.correctAnswer}`}
          </div>
        )}
      </div>
    );
  }

  // RESULTS
  if (phase === 'results') {
    const correct = answered.filter(a => a.isCorrect).length;
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="text-center mb-8">
          <div className={cn('font-pixel text-pixel-2xl mb-2', score >= 85 ? 'text-pixel-emerald' : score >= 50 ? 'text-pixel-gold' : 'text-pixel-red')}>{score}%</div>
          <div className="text-pixel-muted text-pixel-sm font-pixel mb-4">{getScoreLabel(score)}</div>
          <div className="text-white text-pixel-xs font-pixel">{correct} / {answered.length} correct — Level {difficulty}</div>
          <PixelProgress value={score} className="mt-4" color={score >= 85 ? 'emerald' : score >= 50 ? 'gold' : 'red'} />
        </div>

        {difficultyChange !== 'stable' && (
          <div className={cn('text-center font-pixel text-pixel-sm mb-6 py-2 px-4 rounded-lg', difficultyChange === 'up' ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red')}>
            {difficultyChange === 'up' ? '⬆ Level Up!' : '⬇ Level adjusted'}
          </div>
        )}

        <div className="space-y-2 mb-8">
          {answered.map((aq, i) => (
            <div key={i} className={cn('challenge-zone flex items-start gap-3 p-3 rounded-lg', aq.isCorrect ? 'bg-pixel-emerald/10' : 'bg-pixel-red/10')}>
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0', aq.isCorrect ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red')}>
                {aq.isCorrect ? '✓' : '✗'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm mb-1">{aq.question.text}</div>
                <div className="text-pixel-muted text-xs">
                  Your answer: <span className={aq.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'}>{aq.playerAnswer}</span>
                  {!aq.isCorrect && <span> — Correct: <span className="text-pixel-emerald">{aq.question.correctAnswer}</span></span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <PixelButton variant="secondary" onClick={onQuit}>Back</PixelButton>
          <PixelButton variant="primary" onClick={startRound}>Play Again</PixelButton>
        </div>
      </div>
    );
  }

  return null;
}
