import { useState, useCallback, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import { getDifficultyConfig } from './difficulty-config';
import { generateChain, scoreChain } from './chain-generator';
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

export function LinkChain({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [chain, setChain] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
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
    const { chain: newChain, pool: newPool } = generateChain(config.wordCount, config.distractorCount);
    setChain(newChain);
    setPool(newPool);
    setSelected([]);
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
    const { correct, total, perPosition } = scoreChain(selected, chain);
    const finalScore = calculateScore(correct, total);
    setScore(finalScore);
    setResultDetails(perPosition);

    perPosition.every(Boolean) ? sound.playAchievement() : sound.playWrong();

    const timeUsed = performance.now() - startTimeRef.current;
    const categoryHistory = useGameStore.getState().profile.categoryHistory['association'] || [];
    const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
    const { reason } = calculateNewDifficulty(difficulty, withNew);
    setDifficultyChange(reason);

    setPhase('results');

    onComplete({
      challengeId: 'link-chain',
      difficulty,
      score: finalScore,
      accuracy: correct / total,
      totalQuestions: total,
      correctAnswers: correct,
      timeUsed,
      timeAllowed: viewDurationMs,
      timestamp: Date.now(),
    });
  }, [selected, chain, difficulty, viewDurationMs, onComplete, sound]);

  // IDLE
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Link Chain</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Memorize the chain of words in order, then rebuild it from memory.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">{config.wordCount} words — {config.viewingTime}s{config.distractorCount > 0 ? ` — ${config.distractorCount} distractors` : ''}</span>
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
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-6 text-center">Memorize the chain</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {chain.map((word, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-pixel-surface px-4 py-2 pixel-border-muted text-white font-pixel text-pixel-sm capitalize">
                {word}
              </div>
              {i < chain.length - 1 && (
                <span className="text-pixel-gold text-lg">🔗</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RECALL
  if (phase === 'recall') {
    const isFull = selected.length >= chain.length;
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-4 text-center">Rebuild the chain in order</div>

        {/* Selected chain */}
        <div className="min-h-[60px] mb-6 flex flex-wrap items-center justify-center gap-2 bg-pixel-surface/50 p-3 rounded-lg">
          {selected.length === 0 ? (
            <span className="text-pixel-muted text-pixel-xs font-pixel">Tap words below...</span>
          ) : (
            selected.map((word, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-pixel-gold/20 border-2 border-pixel-gold px-3 py-1.5 text-pixel-gold font-pixel text-pixel-xs capitalize">
                  <span className="text-pixel-muted mr-1">{i + 1}.</span>{word}
                </div>
                {i < selected.length - 1 && <span className="text-pixel-gold text-sm">🔗</span>}
              </div>
            ))
          )}
        </div>

        {/* Pool */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {pool.map((word) => {
            const isSelected = selected.includes(word);
            return (
              <button
                key={word}
                onClick={() => {
                  if (!isSelected && !isFull) {
                    sound.playClick();
                    setSelected(prev => [...prev, word]);
                  }
                }}
                disabled={isSelected || isFull}
                className={cn(
                  'px-4 py-2 font-pixel text-pixel-xs capitalize border-2 transition-all',
                  isSelected
                    ? 'border-pixel-surface-light bg-pixel-surface/30 text-pixel-muted opacity-40'
                    : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold cursor-pointer'
                )}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <PixelButton
            variant="secondary"
            size="sm"
            disabled={selected.length === 0}
            onClick={() => setSelected(prev => prev.slice(0, -1))}
          >
            Undo
          </PixelButton>
          <PixelButton
            variant="primary"
            disabled={!isFull}
            onClick={handleSubmit}
          >
            Submit
          </PixelButton>
        </div>

        <div className="text-center text-pixel-xs text-pixel-muted font-pixel mt-3">
          {selected.length} / {chain.length}
        </div>
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
            {correct} / {chain.length} correct — Level {difficulty}
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

        <div className="space-y-2 mb-8">
          {chain.map((word, i) => (
            <div key={i} className={cn(
              'challenge-zone flex items-center gap-3 p-3 rounded-lg',
              resultDetails[i] ? 'bg-pixel-emerald/10' : 'bg-pixel-red/10'
            )}>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                resultDetails[i] ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
              )}>
                {resultDetails[i] ? '✓' : '✗'}
              </div>
              <div className="flex-1 text-sm">
                <span className="text-pixel-muted">{i + 1}.</span>{' '}
                <span className={resultDetails[i] ? 'text-pixel-emerald' : 'text-pixel-red'}>
                  {selected[i] || '—'}
                </span>
                {!resultDetails[i] && (
                  <span className="text-pixel-muted"> → <span className="text-pixel-emerald">{word}</span></span>
                )}
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
