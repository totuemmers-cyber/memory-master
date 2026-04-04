import { cn } from '../../utils/cn';

interface PixelProgressProps {
  value: number; // 0-100
  className?: string;
  color?: 'gold' | 'emerald' | 'red' | 'blue';
}

const COLOR_MAP = {
  gold: 'bg-pixel-gold',
  emerald: 'bg-pixel-emerald',
  red: 'bg-pixel-red',
  blue: 'bg-pixel-blue',
};

export function PixelProgress({ value, className, color = 'emerald' }: PixelProgressProps) {
  const segments = 10;
  const filledSegments = Math.round((value / 100) * segments);

  return (
    <div className={cn('flex gap-0.5', className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-3 flex-1 transition-colors',
            i < filledSegments ? COLOR_MAP[color] : 'bg-pixel-surface-light'
          )}
        />
      ))}
    </div>
  );
}
