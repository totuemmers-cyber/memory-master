import type { Room } from './palace-generator';

interface FloorPlanProps {
  rooms: Room[];
  showItems: boolean;
}

export function FloorPlan({ rooms, showItems }: FloorPlanProps) {
  const cols = rooms.length <= 3 ? rooms.length : rooms.length <= 6 ? 3 : rooms.length <= 9 ? 3 : 4;

  return (
    <div
      className="grid gap-3 max-w-[500px] mx-auto"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-pixel-surface border-2 border-pixel-surface-light p-3 min-h-[100px] flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{room.icon}</span>
            <span className="text-pixel-xs font-pixel text-pixel-gold truncate">{room.name}</span>
          </div>
          {showItems ? (
            <div className="flex-1 flex flex-wrap gap-1 items-start">
              {room.items.map((item) => (
                <span
                  key={item}
                  className="text-pixel-xs bg-pixel-dark/50 px-2 py-0.5 text-pixel-emerald capitalize"
                  style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px' }}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-pixel-xs text-pixel-muted font-pixel">?</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
