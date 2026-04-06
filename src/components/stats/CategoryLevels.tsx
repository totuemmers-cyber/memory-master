import { useGameStore } from '../../state/game-store';
import type { ChallengeCategory } from '../../types';
import { PixelProgress } from '../ui/PixelProgress';

const CATEGORY_META: Record<ChallengeCategory, { label: string; icon: string }> = {
  observation: { label: 'Observation', icon: '👁' },
  association: { label: 'Association', icon: '🔗' },
  spatial: { label: 'Spatial', icon: '🏰' },
  numerical: { label: 'Numerical', icon: '🔢' },
  social: { label: 'Social', icon: '👤' },
  sequential: { label: 'Sequential', icon: '🃏' },
  narrative: { label: 'Narrative', icon: '📖' },
};

export function CategoryLevels() {
  const categoryDifficulties = useGameStore(s => s.profile.categoryDifficulties);

  const categories = Object.entries(CATEGORY_META)
    .map(([key, meta]) => ({
      key: key as ChallengeCategory,
      ...meta,
      level: categoryDifficulties[key as ChallengeCategory] || 0,
    }))
    .filter(c => c.level > 0)
    .sort((a, b) => b.level - a.level);

  if (categories.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-pixel-sm text-white mb-4">Category Levels</h2>
      <div className="bg-pixel-surface p-4 pixel-border-muted space-y-3">
        {categories.map(cat => (
          <div key={cat.key} className="flex items-center gap-3">
            <span className="text-lg w-6 text-center">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-pixel-xs text-pixel-muted">{cat.label}</span>
                <span className="text-pixel-xs text-pixel-gold">Lv.{cat.level}</span>
              </div>
              <PixelProgress value={cat.level * 10} color="gold" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
