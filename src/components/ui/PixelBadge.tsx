import { cn } from '../../utils/cn';
import type { AchievementTier } from '../../types';

const TIER_STYLES: Record<AchievementTier, string> = {
  bronze: 'bg-amber-800 text-amber-200',
  silver: 'bg-gray-400 text-gray-900',
  gold: 'bg-pixel-gold text-pixel-dark',
  diamond: 'bg-cyan-400 text-cyan-950',
};

const ACHIEVEMENT_ICONS: Record<string, string> = {
  eye: '👁',
  star: '⭐',
  medal: '🏅',
  magnifier: '🔍',
  eagle: '🦅',
  target: '🎯',
  fire: '🔥',
  calendar: '📅',
  'arrow-up': '⬆',
  crown: '👑',
};

export function PixelBadge({ icon, tier, unlocked, size = 'md' }: { icon: string; tier: AchievementTier; unlocked: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const emoji = ACHIEVEMENT_ICONS[icon] || '?';
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-sm',
        unlocked ? TIER_STYLES[tier] : 'bg-pixel-surface-light text-pixel-muted',
        {
          'w-8 h-8 text-sm': size === 'sm',
          'w-12 h-12 text-xl': size === 'md',
          'w-16 h-16 text-3xl': size === 'lg',
        },
        !unlocked && 'grayscale'
      )}
    >
      {unlocked ? emoji : '?'}
    </div>
  );
}
