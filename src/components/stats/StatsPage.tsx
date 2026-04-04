import { useGameStore } from '../../state/game-store';
import { ScoreLineChart } from './ScoreLineChart';
import { StreakCalendar } from './StreakCalendar';
import { BestPerformances } from './BestPerformances';

export function StatsPage() {
  const history = useGameStore(s => s.history);

  if (history.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-pixel-gold text-pixel-xl mb-6">Statistiken</h1>
        <div className="text-pixel-muted text-pixel-sm">
          Noch keine Daten. Spiele deine erste Challenge!
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-pixel-gold text-pixel-xl text-center mb-6">Statistiken</h1>
      <ScoreLineChart />
      <StreakCalendar />
      <BestPerformances />
    </div>
  );
}
