import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'locked';
  onClick?: () => void;
}

export function PixelCard({ children, className, variant = 'default', onClick }: PixelCardProps) {
  return (
    <div
      className={cn(
        'p-4 transition-all',
        {
          'bg-pixel-surface pixel-border-muted': variant === 'default',
          'bg-pixel-surface pixel-border': variant === 'highlight',
          'bg-pixel-surface/50 pixel-border-muted opacity-60': variant === 'locked',
        },
        onClick && 'cursor-pointer hover:brightness-110',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
