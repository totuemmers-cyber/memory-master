import { useGameStore } from '../../state/game-store';
import { selectCurrentTitle } from '../../state/selectors';

function PixelLogo() {
  return (
    <div className="text-center mb-4 select-none">
      <div className="inline-block relative">
        <div className="text-pixel-gold text-pixel-2xl tracking-widest leading-none">
          <span className="inline-block animate-pulse" style={{ animationDelay: '0ms', animationDuration: '3s' }}>M</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '100ms', animationDuration: '3s' }}>E</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '200ms', animationDuration: '3s' }}>M</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '300ms', animationDuration: '3s' }}>O</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '400ms', animationDuration: '3s' }}>R</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '500ms', animationDuration: '3s' }}>Y</span>
        </div>
        <div className="text-pixel-emerald text-pixel-lg tracking-[0.3em] mt-1">
          MASTER
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {['bg-pixel-gold', 'bg-pixel-emerald', 'bg-pixel-blue', 'bg-pixel-purple', 'bg-pixel-red'].map((c, i) => (
            <div key={i} className={`w-2 h-2 ${c}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GreetingHeader() {
  const title = useGameStore(selectCurrentTitle);
  const streak = useGameStore(s => s.profile.currentStreak);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="text-center mb-8">
      <PixelLogo />
      <div className="text-pixel-muted text-pixel-xs mb-2 mt-4">{getGreeting()}</div>
      <div className="text-pixel-gold text-pixel-sm mb-2">{title.name}</div>
      {streak > 0 && (
        <div className="text-pixel-sm text-pixel-emerald">
          🔥 {streak} Day Streak
        </div>
      )}
    </div>
  );
}
