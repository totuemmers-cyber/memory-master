import { useState, useCallback, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import { getDifficultyConfig } from './difficulty-config';
import { getRandomEvents, formatEventDate, generateDistractorDates } from './event-generator';
import type { HistoricalEvent } from './event-generator';
import { TimelineDisplay } from './TimelineDisplay';
import { DateRecallInput } from './DateRecallInput';
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

type Phase = 'idle' | 'countdown' | 'memorize' | 'recall' | 'results';

interface RecallResult {
  event: HistoricalEvent;
  playerAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function DateKeeper({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [results, setResults] = useState<RecallResult[]>([]);
  const [countdownValue, setCountdownValue] = useState(3);
  const [score, setScore] = useState(0);
  const [difficultyChange, setDifficultyChange] = useState<'up' | 'down' | 'stable'>('stable');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const startTimeRef = useRef(0);
  const sound = useSound();

  // Precomputed MC options per event
  const [mcOptionsMap, setMcOptionsMap] = useState<string[][]>([]);

  const config = getDifficultyConfig(difficulty);
  const viewDurationMs = config.viewingTime * 1000;

  const viewTimer = useTimer({
    durationMs: viewDurationMs,
    onComplete: useCallback(() => {
      setPhase('recall');
      startTimeRef.current = performance.now();
    }, []),
  });

  const startRound = useCallback(() => {
    const picked = getRandomEvents(config.eventCount);
    setEvents(picked);
    setCurrentEventIndex(0);
    setResults([]);
    setScore(0);
    setDifficultyChange('stable');
    setFeedback(null);

    // Precompute MC options for all events
    if (config.recallFormat === 'multipleChoice') {
      const allOptions = picked.map((ev) => {
        const correct = formatEventDate(ev, config.dateFormat);
        const distractors = generateDistractorDates(ev, config.dateFormat, 3);
        return shuffleArray([correct, ...distractors]);
      });
      setMcOptionsMap(allOptions);
    } else {
      setMcOptionsMap([]);
    }

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

  const advanceOrFinish = useCallback((newResults: RecallResult[], eventsList: HistoricalEvent[]) => {
    const nextIndex = newResults.length;
    if (nextIndex >= eventsList.length) {
      // All events answered - calculate score
      const correct = newResults.filter((r) => r.isCorrect).length;
      const total = newResults.length;
      const finalScore = calculateScore(correct, total);
      setScore(finalScore);

      correct === total ? sound.playAchievement() : sound.playWrong();

      const timeUsed = performance.now() - startTimeRef.current;
      const categoryHistory = useGameStore.getState().profile.categoryHistory['numerical'] || [];
      const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
      const { reason } = calculateNewDifficulty(difficulty, withNew);
      setDifficultyChange(reason);

      setPhase('results');

      onComplete({
        challengeId: 'date-keeper',
        difficulty,
        score: finalScore,
        accuracy: correct / total,
        totalQuestions: total,
        correctAnswers: correct,
        timeUsed,
        timeAllowed: viewDurationMs,
        timestamp: Date.now(),
      });
    } else {
      setCurrentEventIndex(nextIndex);
      setFeedback(null);
    }
  }, [difficulty, viewDurationMs, onComplete, sound]);

  const handleAnswer = useCallback((answer: string) => {
    const event = events[currentEventIndex];
    const correctAnswer = formatEventDate(event, config.dateFormat);
    const isCorrect = answer === correctAnswer;

    isCorrect ? sound.playCorrect() : sound.playWrong();

    const result: RecallResult = { event, playerAnswer: answer, correctAnswer, isCorrect };
    const newResults = [...results, result];
    setResults(newResults);
    setFeedback({ isCorrect, correctAnswer });

    // Brief pause to show feedback, then advance
    setTimeout(() => {
      advanceOrFinish(newResults, events);
    }, 1200);
  }, [events, currentEventIndex, config.dateFormat, results, sound, advanceOrFinish]);

  // IDLE
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Date Keeper</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Memorize when each historical event occurred, then recall the dates from memory.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">
            {config.eventCount} events — {config.viewingTime}s —{' '}
            {config.dateFormat === 'year' ? 'Year only' : config.dateFormat === 'monthYear' ? 'Month + Year' : 'Full date'}
          </span>
        </div>
        <div className="flex gap-3">
          <PixelButton variant="secondary" onClick={onQuit}>Cancel</PixelButton>
          <PixelButton variant="primary" size="lg" onClick={startRound}>Start</PixelButton>
        </div>
      </div>
    );
  }

  // COUNTDOWN
  if (phase === 'countdown') {
    return <CountdownOverlay value={countdownValue} />;
  }

  // MEMORIZE
  if (phase === 'memorize') {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <TimerBar totalMs={viewDurationMs} remainingMs={viewTimer.remainingMs} />
        <div className="text-center mb-6">
          <div className="text-pixel-muted font-pixel text-pixel-xs mb-4">Memorize these dates</div>
        </div>
        <TimelineDisplay events={events} config={config} />
      </div>
    );
  }

  // RECALL
  if (phase === 'recall') {
    const currentEvent = events[currentEventIndex];
    return (
      <div className="p-6 max-w-lg mx-auto">
        <DateRecallInput
          event={currentEvent}
          config={config}
          questionIndex={currentEventIndex}
          totalQuestions={events.length}
          onAnswer={handleAnswer}
          feedback={feedback}
          mcOptions={mcOptionsMap[currentEventIndex]}
        />
      </div>
    );
  }

  // RESULTS
  if (phase === 'results') {
    const correct = results.filter((r) => r.isCorrect).length;
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="text-center mb-8">
          <div className={cn(
            'font-pixel text-pixel-2xl mb-2',
            score >= 85 ? 'text-pixel-emerald' : score >= 50 ? 'text-pixel-gold' : 'text-pixel-red'
          )}>
            {score}%
          </div>
          <div className="text-pixel-muted text-pixel-sm font-pixel mb-4">{getScoreLabel(score)}</div>
          <div className="text-white text-pixel-xs font-pixel">
            {correct} / {events.length} correct — Level {difficulty}
          </div>
          <PixelProgress value={score} className="mt-4" color={score >= 85 ? 'emerald' : score >= 50 ? 'gold' : 'red'} />
        </div>

        {difficultyChange !== 'stable' && (
          <div className={cn(
            'text-center font-pixel text-pixel-sm mb-6 py-2 px-4 rounded-lg',
            difficultyChange === 'up' ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
          )}>
            {difficultyChange === 'up' ? '⬆ Level Up!' : '⬇ Level adjusted'}
          </div>
        )}

        {/* Breakdown */}
        <div className="mb-8">
          <div className="text-pixel-xs text-pixel-muted font-pixel mb-3 text-center">Event breakdown</div>
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border-2',
                  r.isCorrect
                    ? 'border-pixel-emerald/30 bg-pixel-emerald/10'
                    : 'border-pixel-red/30 bg-pixel-red/10'
                )}
              >
                <div className={cn(
                  'font-pixel text-pixel-xs mt-0.5 shrink-0',
                  r.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'
                )}>
                  {r.isCorrect ? '✓' : '✗'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm mb-1">{r.event.name}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {!r.isCorrect && (
                      <span className="text-pixel-red">Your answer: {r.playerAnswer}</span>
                    )}
                    <span className="text-pixel-emerald">Correct: {r.correctAnswer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
