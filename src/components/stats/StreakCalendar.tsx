import { useGameStore } from '../../state/game-store';
import { selectStreakDays } from '../../state/selectors';
import { cn } from '../../utils/cn';

export function StreakCalendar() {
  const streakDays = useGameStore(s => selectStreakDays(s, 84)); // 12 weeks

  // Group by weeks
  const weeks: typeof streakDays[] = [];
  for (let i = 0; i < streakDays.length; i += 7) {
    weeks.push(streakDays.slice(i, i + 7));
  }

  return (
    <div className="mb-8">
      <h2 className="text-pixel-sm text-white mb-4">Aktivitaet</h2>
      <div className="bg-pixel-surface p-4 pixel-border-muted">
        <div className="flex gap-1 justify-center">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.sessionsCount} Sessions${day.completed ? ' (Daily erledigt)' : ''}`}
                  className={cn(
                    'w-3 h-3 rounded-sm transition-colors',
                    day.sessionsCount === 0
                      ? 'bg-pixel-surface-light'
                      : day.completed
                        ? 'bg-pixel-emerald'
                        : day.averageScore >= 80
                          ? 'bg-pixel-gold'
                          : 'bg-pixel-gold/40'
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-pixel-xs text-pixel-muted">
          <div className="w-3 h-3 bg-pixel-surface-light rounded-sm" /> Keine
          <div className="w-3 h-3 bg-pixel-gold/40 rounded-sm" /> Gespielt
          <div className="w-3 h-3 bg-pixel-gold rounded-sm" /> Gut
          <div className="w-3 h-3 bg-pixel-emerald rounded-sm" /> Daily
        </div>
      </div>
    </div>
  );
}
