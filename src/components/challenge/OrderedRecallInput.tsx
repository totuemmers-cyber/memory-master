import { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { cn } from '../../utils/cn';

interface OrderedRecallInputProps {
  items: string[];
  correctOrder: string[];
  onComplete: (playerOrder: string[]) => void;
  renderItem?: (item: string, selected: boolean) => React.ReactNode;
}

export type { OrderedRecallInputProps };

export function OrderedRecallInput({ items, correctOrder, onComplete, renderItem }: OrderedRecallInputProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const targetCount = correctOrder.length;

  function handleSelect(item: string) {
    if (selected.includes(item) || selected.length >= targetCount) return;
    setSelected(prev => [...prev, item]);
  }

  function handleUndo() {
    setSelected(prev => prev.slice(0, -1));
  }

  function handleSubmit() {
    onComplete(selected);
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Selected chain */}
      <div className="bg-pixel-surface rounded-lg p-4 mb-4 min-h-[64px]">
        {selected.length === 0 ? (
          <div className="text-pixel-muted text-pixel-xs font-pixel text-center">
            Tap items below in the correct order
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((item, i) => (
              <div
                key={`${item}-${i}`}
                className="flex items-center gap-1.5 bg-pixel-surface-light rounded px-3 py-1.5"
              >
                <span className="text-pixel-gold font-pixel text-pixel-xs">{i + 1}.</span>
                {renderItem ? renderItem(item, true) : (
                  <span className="text-white text-sm">{item}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pool */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {items.map(item => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              disabled={isSelected}
              onClick={() => handleSelect(item)}
              className={cn(
                'rounded px-4 py-2 text-sm font-pixel transition-all',
                isSelected
                  ? 'bg-pixel-surface-light text-pixel-muted opacity-40 cursor-not-allowed'
                  : 'bg-pixel-surface text-white hover:bg-pixel-surface-light hover:text-pixel-gold active:translate-y-0.5 cursor-pointer'
              )}
            >
              {renderItem ? renderItem(item, false) : item}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <PixelButton variant="secondary" size="sm" onClick={handleUndo} disabled={selected.length === 0}>
          Undo
        </PixelButton>
        <PixelButton variant="primary" size="sm" onClick={handleSubmit} disabled={selected.length < targetCount}>
          Submit
        </PixelButton>
      </div>
    </div>
  );
}
