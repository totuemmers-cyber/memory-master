import type { Card } from './card-generator';
import { SUIT_SYMBOLS, SUIT_COLORS } from './card-generator';
import { cn } from '../../utils/cn';

interface PlayingCardProps {
  card: Card;
  faceDown?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const SIZE_CLASSES = {
  sm: 'w-12 h-16 text-[10px]',
  md: 'w-[60px] h-20 text-xs',
} as const;

const SYMBOL_SIZE = {
  sm: 'text-base',
  md: 'text-xl',
} as const;

export function PlayingCard({
  card,
  faceDown = false,
  selected = false,
  disabled = false,
  onClick,
  size = 'md',
}: PlayingCardProps) {
  const suitColor = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];

  if (faceDown) {
    return (
      <div
        className={cn(
          SIZE_CLASSES[size],
          'bg-pixel-surface pixel-border-muted rounded-sm flex items-center justify-center select-none',
          'bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.04)_3px,rgba(255,255,255,0.04)_6px)]'
        )}
      >
        <div className="text-pixel-muted opacity-40 font-pixel text-[10px]">?</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || selected}
      className={cn(
        SIZE_CLASSES[size],
        'bg-pixel-surface pixel-border-muted rounded-sm flex flex-col items-center justify-between p-1 select-none transition-all relative',
        selected && 'opacity-30 grayscale',
        !disabled && !selected && onClick && 'cursor-pointer hover:border-pixel-gold hover:scale-105 active:scale-95',
        disabled && !selected && 'cursor-default'
      )}
    >
      {/* Rank in top-left corner */}
      <div className={cn('self-start leading-none font-pixel font-bold', suitColor)}>
        {card.rank}
      </div>

      {/* Suit symbol in center */}
      <div className={cn(SYMBOL_SIZE[size], 'leading-none', suitColor)}>
        {symbol}
      </div>

      {/* Rank in bottom-right corner (inverted) */}
      <div className={cn('self-end leading-none font-pixel font-bold rotate-180', suitColor)}>
        {card.rank}
      </div>
    </button>
  );
}
