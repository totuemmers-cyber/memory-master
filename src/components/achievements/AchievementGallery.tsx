import { useGameStore } from '../../state/game-store';
import { ALL_ACHIEVEMENTS } from '../../data/achievements';
import { AchievementCard } from './AchievementCard';

export function AchievementGallery() {
  const progress = useGameStore(s => s.achievements);

  const unlockedCount = progress.filter(a => a.unlocked).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-pixel-gold text-pixel-xl text-center mb-2">Achievements</h1>
      <div className="text-pixel-muted text-pixel-xs text-center mb-6">
        {unlockedCount} / {ALL_ACHIEVEMENTS.length} freigeschaltet
      </div>
      <div className="space-y-3">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const p = progress.find(a => a.achievementId === ach.id);
          return (
            <AchievementCard
              key={ach.id}
              achievement={ach}
              unlocked={p?.unlocked || false}
              unlockedAt={p?.unlockedAt}
            />
          );
        })}
      </div>
    </div>
  );
}
