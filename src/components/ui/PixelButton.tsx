import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function PixelButton({ variant = 'primary', size = 'md', className, children, ...props }: PixelButtonProps) {
  return (
    <button
      className={cn(
        'font-pixel transition-all active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-pixel-gold text-pixel-dark hover:bg-pixel-gold/90 pixel-border': variant === 'primary',
          'bg-pixel-surface text-white hover:bg-pixel-surface-light pixel-border-muted': variant === 'secondary',
          'bg-pixel-red text-white hover:bg-pixel-red/90': variant === 'danger',
          'bg-transparent text-pixel-muted hover:text-white': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-pixel-xs': size === 'sm',
          'px-5 py-2.5 text-pixel-sm': size === 'md',
          'px-8 py-3.5 text-pixel-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
