interface TimerBarProps {
  totalMs: number;
  remainingMs: number;
}

export function TimerBar({ totalMs, remainingMs }: TimerBarProps) {
  const pct = (remainingMs / totalMs) * 100;
  const color = pct > 50 ? 'bg-pixel-emerald' : pct > 25 ? 'bg-pixel-gold' : 'bg-pixel-red';

  return (
    <div className="w-full max-w-[600px] mx-auto h-2 bg-pixel-surface-light rounded-full overflow-hidden mb-4">
      <div
        className={`h-full ${color} transition-all duration-100 ease-linear`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
