import { cn } from '../../utils/cn';

interface DigitDisplayProps {
  digits: string[];
  revealed?: boolean;
  playerDigits?: string[];
  correctDigits?: string[];
}

export function DigitDisplay({ digits, revealed = true, playerDigits, correctDigits }: DigitDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-[500px] mx-auto">
      {digits.map((d, i) => {
        const showResult = playerDigits && correctDigits;
        const isCorrect = showResult ? playerDigits[i] === correctDigits[i] : undefined;

        return (
          <div
            key={i}
            className={cn(
              'w-10 h-14 flex items-center justify-center font-pixel text-pixel-lg border-2 transition-all',
              showResult
                ? isCorrect
                  ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                  : 'border-pixel-red bg-pixel-red/20 text-pixel-red'
                : 'border-pixel-gold bg-pixel-surface text-pixel-gold'
            )}
          >
            {revealed ? d : '?'}
          </div>
        );
      })}
    </div>
  );
}
