import { useGameStore } from '../../state/game-store';
import { selectCurrentTitle } from '../../state/selectors';

export function GreetingHeader() {
  const title = useGameStore(selectCurrentTitle);
  const streak = useGameStore(s => s.profile.currentStreak);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <div className="text-center mb-8">
      <div className="text-pixel-muted text-pixel-xs mb-2">{getGreeting()}</div>
      <h1 className="text-pixel-gold text-pixel-xl mb-2">{title.name}</h1>
      {streak > 0 && (
        <div className="text-pixel-sm text-pixel-emerald">
          🔥 {streak} Tage Serie
        </div>
      )}
    </div>
  );
}
