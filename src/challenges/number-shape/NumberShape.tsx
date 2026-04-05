import { useState, useCallback, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import { getDifficultyConfig } from './difficulty-config';
import { generateSequence, scoreSequence } from './number-generator';
import { DigitDisplay } from './DigitDisplay';
import { DigitInput } from './DigitInput';
import { CountdownOverlay } from '../../challenges/observation-chamber/CountdownOverlay';
import { TimerBar } from '../../challenges/observation-chamber/TimerBar';
import { PixelButton } from '../../components/ui/PixelButton';
import { PixelProgress } from '../../components/ui/PixelProgress';
import { useTimer } from '../../hooks/useTimer';
import { useSound } from '../../hooks/useSound';
import { calculateScore } from '../../engine/scoring';
import { getScoreLabel } from '../../engine/scoring';
import { calculateNewDifficulty } from '../../engine/adaptive-difficulty';
import { useGameStore } from '../../state/game-store';
import { cn } from '../../utils/cn';

type Phase = 'idle' | 'countdown' | 'memorize' | 'recall' | 'results';

export function NumberShape({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerDigits, setPlayerDigits] = useState<string[]>([]);
  const [countdownValue, setCountdownValue] = useState(3);
  const [score, setScore] = useState(0);
  const [resultDetails, setResultDetails] = useState<boolean[]>([]);
  const [difficultyChange, setDifficultyChange] = useState<'up' | 'down' | 'stable'>('stable');
  const startTimeRef = useRef(0);
  const sound = useSound();

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
    const seq = generateSequence(config.digitCount);
    setSequence(seq);
    setPlayerDigits([]);
    setScore(0);
    setResultDetails([]);
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
        setPhase('memorize');
        viewTimer.start();
        sound.playStart();
      }
    }, 1000);
  }, [config, sound, viewTimer]);

  const handleSubmit = useCallback(() => {
    const { correct, total, perPosition } = scoreSequence(playerDigits, sequence);
    const finalScore = calculateScore(correct, total);
    setScore(finalScore);
    setResultDetails(perPosition);

    perPosition.every(Boolean) ? sound.playAchievement() : sound.playWrong();

    const timeUsed = performance.now() - startTimeRef.current;
    const categoryHistory = useGameStore.getState().profile.categoryHistory['numerical'] || [];
    const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
    const { reason } = calculateNewDifficulty(difficulty, withNew);
    setDifficultyChange(reason);

    setPhase('results');

    onComplete({
      challengeId: 'number-shape',
      difficulty,
      score: finalScore,
      accuracy: correct / total,
      totalQuestions: total,
      correctAnswers: correct,
      timeUsed,
      timeAllowed: viewDurationMs,
      timestamp: Date.now(),
    });
  }, [playerDigits, sequence, difficulty, viewDurationMs, onComplete, sound]);

  // IDLE
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Number Shape</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Memorize the number sequence, then type it back from memory.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">{config.digitCount} digits — {config.viewingTime}s</span>
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
          <div className="text-pixel-muted font-pixel text-pixel-xs mb-4">Memorize this sequence</div>
          <DigitDisplay digits={sequence} />
        </div>
      </div>
    );
  }

  // RECALL
  if (phase === 'recall') {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-pixel-muted font-pixel text-pixel-xs mb-4">Enter the sequence</div>
        </div>
        <DigitInput
          digitCount={config.digitCount}
          currentDigits={playerDigits}
          onDigit={(d) => {
            sound.playClick();
            setPlayerDigits(prev => [...prev, d]);
          }}
          onDelete={() => setPlayerDigits(prev => prev.slice(0, -1))}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  // RESULTS
  if (phase === 'results') {
    const correct = resultDetails.filter(Boolean).length;
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
            {correct} / {sequence.length} correct — Level {difficulty}
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

        <div className="mb-8">
          <div className="text-pixel-xs text-pixel-muted font-pixel mb-3 text-center">Your answer vs correct</div>
          <div className="flex justify-center gap-1 mb-2">
            {sequence.map((d, i) => (
              <div key={`correct-${i}`} className="w-8 h-10 flex items-center justify-center font-pixel text-pixel-sm border-2 border-pixel-emerald/50 bg-pixel-emerald/10 text-pixel-emerald">
                {d}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1">
            {playerDigits.map((d, i) => (
              <div key={`player-${i}`} className={cn(
                'w-8 h-10 flex items-center justify-center font-pixel text-pixel-sm border-2',
                resultDetails[i]
                  ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                  : 'border-pixel-red bg-pixel-red/20 text-pixel-red'
              )}>
                {d}
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
