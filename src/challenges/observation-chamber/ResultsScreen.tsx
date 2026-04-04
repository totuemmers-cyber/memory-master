import type { AnsweredQuestion } from './types';
import { PixelButton } from '../../components/ui/PixelButton';
import { PixelProgress } from '../../components/ui/PixelProgress';
import { getScoreLabel } from '../../engine/scoring';
import { cn } from '../../utils/cn';

interface ResultsScreenProps {
  score: number;
  answeredQuestions: AnsweredQuestion[];
  difficulty: number;
  difficultyChange: 'up' | 'down' | 'stable';
  onPlayAgain: () => void;
  onBack: () => void;
}

export function ResultsScreen({ score, answeredQuestions, difficulty, difficultyChange, onPlayAgain, onBack }: ResultsScreenProps) {
  const correct = answeredQuestions.filter(a => a.isCorrect).length;
  const total = answeredQuestions.length;

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
          {difficultyChange === 'up' ? '⬆ Level Up!' : '⬇ Level adjusted'}
        </div>
      )}

      {/* Question breakdown */}
      <div className="space-y-3 mb-8">
        {answeredQuestions.map((aq, i) => (
          <div key={i} className="challenge-zone bg-pixel-surface rounded-lg p-3 flex items-start gap-3">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
              aq.isCorrect ? 'bg-pixel-emerald/20 text-pixel-emerald' : 'bg-pixel-red/20 text-pixel-red'
            )}>
              {aq.isCorrect ? '✓' : '✗'}
            </div>
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
