import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import type { FaceData, FaceQuestion, AnsweredFaceQuestion, FaceVaultPhase } from './types';
import { getDifficultyConfig } from './difficulty-config';
import { generateFaces } from './face-generator';
import { generateNameQuestions, generateAttributeQuestions } from './question-generator';
import { calculateScore } from '../../engine/scoring';
import { getScoreLabel } from '../../engine/scoring';
import { calculateNewDifficulty } from '../../engine/adaptive-difficulty';
import { useGameStore } from '../../state/game-store';
import { useTimer } from '../../hooks/useTimer';
import { useSound } from '../../hooks/useSound';
import { CountdownOverlay } from '../observation-chamber/CountdownOverlay';
import { TimerBar } from '../observation-chamber/TimerBar';
import { PixelFace } from './PixelFace';
import { PixelButton } from '../../components/ui/PixelButton';
import { PixelProgress } from '../../components/ui/PixelProgress';
import { cn } from '../../utils/cn';

export function FaceVault({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<FaceVaultPhase>('idle');
  const [faces, setFaces] = useState<FaceData[]>([]);
  const [questions, setQuestions] = useState<FaceQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answered, setAnswered] = useState<AnsweredFaceQuestion[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [countdownValue, setCountdownValue] = useState(3);
  const [score, setScore] = useState(0);
  const [difficultyChange, setDifficultyChange] = useState<'up' | 'down' | 'stable'>('stable');
  const questionStartRef = useRef(performance.now());
  const sound = useSound();

  const config = getDifficultyConfig(difficulty);
  const viewDurationMs = config.viewingTime * 1000;

  // View timer
  const viewTimer = useTimer({
    durationMs: viewDurationMs,
    onComplete: useCallback(() => {
      setPhase('recall');
      setCurrentQIndex(0);
      questionStartRef.current = performance.now();
    }, []),
  });

  // Handle tab visibility during memorize phase
  useEffect(() => {
    if (phase !== 'memorize') return;
    const handleVisibility = () => {
      if (document.hidden) viewTimer.pause();
      else viewTimer.resume();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [phase, viewTimer]);

  const startRound = useCallback(() => {
    const newFaces = generateFaces(config.faceCount);
    const nameQs = generateNameQuestions(newFaces);
    const attrQs = generateAttributeQuestions(newFaces, config.extraQuestions);
    const allQuestions = [...nameQs, ...attrQs];

    setFaces(newFaces);
    setQuestions(allQuestions);
    setAnswered([]);
    setFeedback(null);
    setCurrentQIndex(0);
    setScore(0);
    setDifficultyChange('stable');

    // Start countdown
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
        setPhase('memorize');
        viewTimer.start();
        sound.playStart();
      }
    }, 1000);
  }, [config, sound, viewTimer]);

  const handleAnswer = useCallback((answer: string) => {
    const q = questions[currentQIndex];
    const isCorrect = answer === q.correctAnswer;
    const timeTaken = performance.now() - questionStartRef.current;

    if (isCorrect) sound.playCorrect();
    else sound.playWrong();

    const aq: AnsweredFaceQuestion = {
      question: q,
      playerAnswer: answer,
      isCorrect,
      timeTakenMs: timeTaken,
    };

    setFeedback({ isCorrect, correctAnswer: q.correctAnswer });
    setAnswered(prev => [...prev, aq]);

    // Move to next question after delay
    setTimeout(() => {
      setFeedback(null);
      const nextIndex = currentQIndex + 1;
      if (nextIndex >= questions.length) {
        // All questions answered
        const allAnswered = [...answered, aq];
        const finalScore = calculateScore(
          allAnswered.filter(a => a.isCorrect).length,
          allAnswered.length
        );
        setScore(finalScore);

        // Calculate difficulty change
        const categoryHistory = useGameStore.getState().profile.categoryHistory['social'] || [];
        const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
        const { reason } = calculateNewDifficulty(difficulty, withNew);
        setDifficultyChange(reason);

        setPhase('results');

        // Report to parent
        onComplete({
          challengeId: 'face-vault',
          difficulty,
          score: finalScore,
          accuracy: allAnswered.filter(a => a.isCorrect).length / allAnswered.length,
          totalQuestions: allAnswered.length,
          correctAnswers: allAnswered.filter(a => a.isCorrect).length,
          timeUsed: allAnswered.reduce((sum, a) => sum + a.timeTakenMs, 0),
          timeAllowed: viewDurationMs,
          timestamp: Date.now(),
        });
      } else {
        setCurrentQIndex(nextIndex);
        questionStartRef.current = performance.now();
      }
    }, 1200);
  }, [questions, currentQIndex, answered, difficulty, viewDurationMs, onComplete, sound]);

  // Helper to find a face by id
  const faceById = useCallback((id: string) => faces.find(f => f.id === id), [faces]);

  // --- IDLE PHASE ---
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Face Vault</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Memorize the faces and their names. Then recall who is who.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">
            {config.faceCount} faces — {config.viewingTime}s — {config.faceCount + config.extraQuestions} questions
          </span>
        </div>
        <div className="flex gap-3">
          <PixelButton variant="secondary" onClick={onQuit}>Cancel</PixelButton>
          <PixelButton variant="primary" size="lg" onClick={startRound}>Start</PixelButton>
        </div>
      </div>
    );
  }

  // --- COUNTDOWN PHASE ---
  if (phase === 'countdown') {
    return <CountdownOverlay value={countdownValue} />;
  }

  // --- MEMORIZE PHASE ---
  if (phase === 'memorize') {
    return (
      <div className="p-6">
        <TimerBar totalMs={viewDurationMs} remainingMs={viewTimer.remainingMs} />
        <div className="text-center mb-6">
          <div className="text-pixel-gold font-pixel text-pixel-sm">Memorize these faces!</div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
          {faces.map(face => (
            <div key={face.id} className="flex flex-col items-center gap-2 p-3 bg-pixel-surface rounded-lg pixel-border-muted">
              <PixelFace face={face} size={80} showName />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RECALL PHASE ---
  if (phase === 'recall' && questions[currentQIndex]) {
    const q = questions[currentQIndex];
    const currentFace = q.faceId ? faceById(q.faceId) : null;

    return (
      <div className="p-6">
        <div className="challenge-zone max-w-lg mx-auto">
          {/* Progress */}
          <div className="text-pixel-muted text-pixel-xs mb-6 text-center font-pixel">
            Question {currentQIndex + 1} / {questions.length}
          </div>

          {/* Show face for name questions */}
          {currentFace && (
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-pixel-surface rounded-lg pixel-border-muted">
                <PixelFace face={currentFace} size={100} showName={false} />
              </div>
            </div>
          )}

          {/* Question text */}
          <h3 className="text-lg font-medium text-white mb-8 text-center leading-relaxed">
            {q.text}
          </h3>

          {/* MC options */}
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
                    : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold hover:bg-pixel-surface-light cursor-pointer'
                )}
              >
                <span className="font-pixel text-pixel-xs text-pixel-muted mr-3">{i + 1}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={cn(
              'mt-6 text-center font-pixel text-pixel-sm',
              feedback.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'
            )}>
              {feedback.isCorrect ? 'Correct!' : `Wrong! Answer: ${feedback.correctAnswer}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS PHASE ---
  if (phase === 'results') {
    const correct = answered.filter(a => a.isCorrect).length;
    const total = answered.length;

    return (
      <div className="max-w-lg mx-auto p-6">
        {/* Score */}
        <div className="text-center mb-8">
          <div className={cn(
            'font-pixel text-pixel-2xl mb-2',
            score >= 85 ? 'text-pixel-emerald' : score >= 50 ? 'text-pixel-gold' : 'text-pixel-red'
          )}>
            {score}%
          </div>
          <div className="text-pixel-muted text-pixel-sm font-pixel mb-4">
            {getScoreLabel(score)}
          </div>
          <div className="text-white text-pixel-xs font-pixel">
            {correct} / {total} correct — Level {difficulty}
          </div>
          <PixelProgress value={score} className="mt-4" color={score >= 85 ? 'emerald' : score >= 50 ? 'gold' : 'red'} />
        </div>

        {/* Difficulty change */}
        {difficultyChange !== 'stable' && (
          <div className={cn(
            'text-center font-pixel text-pixel-sm mb-6 py-2 px-4 rounded-lg',
            difficultyChange === 'up' ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
          )}>
            {difficultyChange === 'up' ? 'Level Up!' : 'Level adjusted'}
          </div>
        )}

        {/* Question breakdown */}
        <div className="space-y-3 mb-8">
          {answered.map((aq, i) => {
            const qFace = aq.question.faceId ? faceById(aq.question.faceId) : null;
            return (
              <div key={i} className="challenge-zone bg-pixel-surface rounded-lg p-3 flex items-start gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
                  aq.isCorrect ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
                )}>
                  {aq.isCorrect ? '\u2713' : '\u2717'}
                </div>
                {qFace && (
                  <div className="flex-shrink-0">
                    <PixelFace face={qFace} size={40} showName={false} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm mb-1">{aq.question.text}</div>
                  <div className="text-pixel-muted text-xs">
                    Your answer: <span className={aq.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'}>{aq.playerAnswer}</span>
                    {!aq.isCorrect && (
                      <span> — Correct: <span className="text-pixel-emerald">{aq.question.correctAnswer}</span></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <PixelButton variant="secondary" onClick={onQuit}>
            Back
          </PixelButton>
          <PixelButton variant="primary" onClick={startRound}>
            Play Again
          </PixelButton>
        </div>
      </div>
    );
  }

  return null;
}
