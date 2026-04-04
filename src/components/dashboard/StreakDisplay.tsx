import { useGameStore } from '../../state/game-store';

export function StreakDisplay() {
  const streak = useGameStore(s => s.profile.currentStreak);
  const longest = useGameStore(s => s.profile.longestStreak);
  const total = useGameStore(s => s.profile.totalSessions);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-pixel-surface p-3 text-center pixel-border-muted">
        <div className="text-pixel-gold text-pixel-lg">{streak}</div>
        <div className="text-pixel-muted text-pixel-xs mt-1">Streak</div>
      </div>
      <div className="bg-pixel-surface p-3 text-center pixel-border-muted">
        <div className="text-pixel-emerald text-pixel-lg">{longest}</div>
        <div className="text-pixel-muted text-pixel-xs mt-1">Record</div>
      </div>
      <div className="bg-pixel-surface p-3 text-center pixel-border-muted">
        <div className="text-pixel-blue text-pixel-lg">{total}</div>
        <div className="text-pixel-muted text-pixel-xs mt-1">Sessions</div>
      </div>
    </div>
  );
}
