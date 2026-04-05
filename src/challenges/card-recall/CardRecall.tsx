import { useState, useCallback, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import { getDifficultyConfig } from './difficulty-config';
import { generateCardSequence, scoreCardSequence, cardId } from './card-generator';
import type { Card } from './card-generator';
import { PlayingCard } from './PlayingCard';
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

export function CardRecall({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<Card[]>([]);
  const [pool, setPool] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
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
    const { sequence: newSequence, pool: newPool } = generateCardSequence(
      config.cardCount,
      config.distractorCount
    );
    setSequence(newSequence);
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
    const { correct, total, perPosition } = scoreCardSequence(selected, sequence);
    const finalScore = calculateScore(correct, total);
    setScore(finalScore);
    setResultDetails(perPosition);

    perPosition.every(Boolean) ? sound.playAchievement() : sound.playWrong();

    const timeUsed = performance.now() - startTimeRef.current;
    const categoryHistory = useGameStore.getState().profile.categoryHistory['sequential'] || [];
    const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
    const { reason } = calculateNewDifficulty(difficulty, withNew);
    setDifficultyChange(reason);

    setPhase('results');

    onComplete({
      challengeId: 'card-recall',
      difficulty,
      score: finalScore,
      accuracy: correct / total,
      totalQuestions: total,
      correctAnswers: correct,
      timeUsed,
      timeAllowed: viewDurationMs,
      timestamp: Date.now(),
    });
  }, [selected, sequence, difficulty, viewDurationMs, onComplete, sound]);

  // IDLE
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Card Recall</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Memorize the sequence of playing cards, then reconstruct it from memory by tapping cards in order.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">
            {config.cardCount} cards — {config.viewingTime}s
            {config.distractorCount > 0 ? ` — ${config.distractorCount} distractors` : ''}
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
      <div className="p-6 max-w-2xl mx-auto">
        <TimerBar totalMs={viewDurationMs} remainingMs={viewTimer.remainingMs} />
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-6 text-center">
          Memorize the sequence
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center justify-center gap-2 min-w-min px-2">
            {sequence.map((card, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <PlayingCard card={card} size="md" />
                {i < sequence.length - 1 && (
                  <span className="text-pixel-muted text-xs font-pixel">{'>'}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // RECALL
  if (phase === 'recall') {
    const isFull = selected.length >= sequence.length;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-4 text-center">
          Rebuild the card sequence in order
        </div>

        {/* Selected sequence */}
        <div className="min-h-[100px] mb-6 flex flex-wrap items-center justify-center gap-2 bg-pixel-surface/50 p-3 rounded-lg">
          {selected.length === 0 ? (
            <span className="text-pixel-muted text-pixel-xs font-pixel">Tap cards below...</span>
          ) : (
            selected.map((card, i) => (
              <div key={i} className="flex items-center gap-1 flex-shrink-0">
                <div className="relative">
                  <div className="absolute -top-2 -left-1 text-pixel-gold font-pixel text-[9px] z-10">
                    {i + 1}
                  </div>
                  <PlayingCard card={card} size="sm" />
                </div>
                {i < selected.length - 1 && (
                  <span className="text-pixel-muted text-[10px] font-pixel">{'>'}</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pool */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {pool.map((card) => {
            const id = cardId(card);
            const isSelected = selected.some(
              (s) => s.rank === card.rank && s.suit === card.suit
            );
            return (
              <PlayingCard
                key={id}
                card={card}
                selected={isSelected}
                disabled={isFull}
                onClick={() => {
                  if (!isSelected && !isFull) {
                    sound.playClick();
                    setSelected((prev) => [...prev, card]);
                  }
                }}
                size="md"
              />
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <PixelButton
            variant="secondary"
            size="sm"
            disabled={selected.length === 0}
            onClick={() => setSelected((prev) => prev.slice(0, -1))}
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
          {selected.length} / {sequence.length}
        </div>
      </div>
    );
  }

  // RESULTS
  if (phase === 'results') {
    const correct = resultDetails.filter(Boolean).length;
    return (
      <div className="max-w-2xl mx-auto p-6">
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

        {/* Per-position breakdown */}
        <div className="space-y-2 mb-8">
          {sequence.map((card, i) => (
            <div key={i} className={cn(
              'challenge-zone flex items-center gap-3 p-3 rounded-lg',
              resultDetails[i] ? 'bg-pixel-emerald/10' : 'bg-pixel-red/10'
            )}>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                resultDetails[i] ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
              )}>
                {resultDetails[i] ? '\u2713' : '\u2717'}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-pixel-muted font-pixel text-pixel-xs">{i + 1}.</span>
                {selected[i] ? (
                  <PlayingCard card={selected[i]} size="sm" />
                ) : (
                  <span className="text-pixel-muted font-pixel text-pixel-xs">--</span>
                )}
                {!resultDetails[i] && (
                  <>
                    <span className="text-pixel-muted font-pixel text-pixel-xs">{'→'}</span>
                    <PlayingCard card={card} size="sm" />
                  </>
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
