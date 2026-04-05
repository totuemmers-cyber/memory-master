import type { HistoricalEvent } from './event-generator';
import { formatEventDate } from './event-generator';
import type { DateKeeperDifficulty } from './difficulty-config';

interface TimelineDisplayProps {
  events: HistoricalEvent[];
  config: DateKeeperDifficulty;
}

export function TimelineDisplay({ events, config }: TimelineDisplayProps) {
  return (
    <div className="flex flex-col gap-3 max-w-md mx-auto">
      {events.map((event, i) => (
        <div key={i} className="flex items-center gap-3">
          {/* Left: Event name */}
          <div className="flex-1 text-right">
            <span className="text-white text-sm leading-tight">{event.name}</span>
          </div>

          {/* Dotted connector */}
          <div className="flex items-center w-16 shrink-0">
            <div className="w-2 h-2 rounded-full bg-pixel-gold shrink-0" />
            <div className="flex-1 border-t-2 border-dotted border-pixel-gold/50" />
            <div className="w-2 h-2 rounded-full bg-pixel-gold shrink-0" />
          </div>

          {/* Right: Date */}
          <div className="flex-1 text-left">
            <span className="font-pixel text-pixel-xs text-pixel-gold">
              {formatEventDate(event, config.dateFormat)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
