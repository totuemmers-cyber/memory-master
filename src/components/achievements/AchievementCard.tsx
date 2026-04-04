import type { Achievement } from '../../types';
import { PixelBadge } from '../ui/PixelBadge';
import { cn } from '../../utils/cn';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: number;
}

export function AchievementCard({ achievement, unlocked, unlockedAt }: AchievementCardProps) {
  return (
    <div className={cn(
      'bg-pixel-surface p-4 pixel-border-muted flex items-center gap-3 transition-all',
      unlocked ? 'opacity-100' : 'opacity-50'
    )}>
      <PixelBadge icon={achievement.icon} tier={achievement.tier} unlocked={unlocked} />
      <div className="flex-1 min-w-0">
        <div className={cn(
          'text-pixel-sm font-pixel',
          unlocked ? 'text-pixel-gold' : 'text-pixel-muted'
        )}>
          {unlocked || !achievement.secret ? achievement.name : '???'}
        </div>
        <div className="text-pixel-xs text-pixel-muted mt-1">
          {unlocked || !achievement.secret ? achievement.description : 'Secret'}
        </div>
        {unlocked && unlockedAt && (
          <div className="text-pixel-xs text-pixel-muted mt-1">
            {new Date(unlockedAt).toLocaleDateString('en-US')}
          </div>
        )}
      </div>
    </div>
  );
}
