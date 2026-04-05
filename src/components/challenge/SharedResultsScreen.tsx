import { PixelButton } from '../ui/PixelButton';
import { PixelProgress } from '../ui/PixelProgress';
import { getScoreLabel } from '../../engine/scoring';
import { cn } from '../../utils/cn';

interface ResultItem {
  label: string;
  playerAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface SharedResultsScreenProps {
  score: number;
  correct: number;
  total: number;
  difficulty: number;
  difficultyChange: 'up' | 'down' | 'stable';
  items: ResultItem[];
  onPlayAgain: () => void;
  onBack: () => void;
}

export type { ResultItem, SharedResultsScreenProps };

export function SharedResultsScreen({ score, correct, total, difficulty, difficultyChange, items, onPlayAgain, onBack }: SharedResultsScreenProps) {
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
          {difficultyChange === 'up' ? '\u2B06 Level Up!' : '\u2B07 Level adjusted'}
        </div>
      )}

      {/* Item breakdown */}
      <div className="space-y-3 mb-8">
        {items.map((item, i) => (
          <div key={i} className="challenge-zone bg-pixel-surface rounded-lg p-3 flex items-start gap-3">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
              item.isCorrect ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
            )}>
              {item.isCorrect ? '\u2713' : '\u2717'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm mb-1">{item.label}</div>
              <div className="text-pixel-muted text-xs">
                Your answer: <span className={item.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'}>{item.playerAnswer}</span>
                {!item.isCorrect && (
                  <span> — Correct: <span className="text-pixel-emerald">{item.correctAnswer}</span></span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <PixelButton variant="secondary" onClick={onBack}>
          Back
        </PixelButton>
        <PixelButton variant="primary" onClick={onPlayAgain}>
          Play Again
        </PixelButton>
      </div>
    </div>
  );
}
