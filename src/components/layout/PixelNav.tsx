import { useLocation, useNavigate } from 'react-router';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/free-training', label: 'Train', icon: '⚔' },
  { path: '/stats', label: 'Stats', icon: '◈' },
  { path: '/achievements', label: 'Awards', icon: '★' },
  { path: '/settings', label: 'Setup', icon: '⚙' },
];

export function PixelNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav during active challenges
  if (location.pathname.startsWith('/challenge/')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pixel-darker border-t-2 border-pixel-gold z-50">
      <div className="max-w-2xl mx-auto flex justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-3 px-2 transition-colors ${
                isActive
                  ? 'text-pixel-gold'
                  : 'text-pixel-muted hover:text-pixel-gold/70'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-pixel-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
