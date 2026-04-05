interface DigitInputProps {
  digitCount: number;
  currentDigits: string[];
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

export function DigitInput({ digitCount, currentDigits, onDigit, onDelete, onSubmit }: DigitInputProps) {
  const isFull = currentDigits.length >= digitCount;

  return (
    <div className="max-w-xs mx-auto">
      {/* Current input display */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {Array.from({ length: digitCount }).map((_, i) => (
          <div
            key={i}
            className={`w-9 h-12 flex items-center justify-center font-pixel text-pixel-base border-2 ${
              i < currentDigits.length
                ? 'border-pixel-gold bg-pixel-surface text-pixel-gold'
                : i === currentDigits.length
                  ? 'border-pixel-gold/50 bg-pixel-surface-light text-pixel-muted'
                  : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
            }`}
          >
            {currentDigits[i] || ''}
          </div>
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => !isFull && onDigit(String(n))}
            disabled={isFull}
            className="h-12 bg-pixel-surface text-white font-pixel text-pixel-base border-2 border-pixel-surface-light hover:border-pixel-gold transition-colors disabled:opacity-40"
          >
            {n}
          </button>
        ))}
        <button
          onClick={onDelete}
          disabled={currentDigits.length === 0}
          className="h-12 bg-pixel-surface text-pixel-red font-pixel text-pixel-xs border-2 border-pixel-surface-light hover:border-pixel-red transition-colors disabled:opacity-40"
        >
          DEL
        </button>
        <button
          onClick={() => !isFull && onDigit('0')}
          disabled={isFull}
          className="h-12 bg-pixel-surface text-white font-pixel text-pixel-base border-2 border-pixel-surface-light hover:border-pixel-gold transition-colors disabled:opacity-40"
        >
          0
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFull}
          className="h-12 bg-pixel-gold text-pixel-dark font-pixel text-pixel-xs border-2 border-pixel-gold hover:bg-pixel-gold/90 transition-colors disabled:opacity-40"
        >
          OK
        </button>
      </div>

      <div className="text-center text-pixel-xs text-pixel-muted font-pixel">
        {currentDigits.length} / {digitCount}
      </div>
    </div>
  );
}
