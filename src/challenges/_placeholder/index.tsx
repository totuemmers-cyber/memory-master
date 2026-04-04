import { challengeRegistry } from '../../engine/challenge-registry';
import { PLACEHOLDER_CHALLENGES } from '../../data/placeholder-challenges';
import type { ChallengeModule, ChallengeProps } from '../../types';

function PlaceholderComponent({ onQuit }: ChallengeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
      <div className="text-pixel-gold font-pixel text-pixel-xl">Coming Soon</div>
      <div className="text-pixel-muted font-pixel text-pixel-xs text-center max-w-sm">
        This challenge will be unlocked in a future update.
      </div>
      <button
        onClick={onQuit}
        className="px-6 py-3 bg-pixel-surface text-white font-pixel text-pixel-sm pixel-border-muted hover:brightness-110"
      >
        Back
      </button>
    </div>
  );
}

for (const placeholder of PLACEHOLDER_CHALLENGES) {
  const module: ChallengeModule = {
    id: placeholder.id,
    name: placeholder.name,
    nameDE: placeholder.nameDE,
    description: placeholder.description,
    icon: placeholder.icon,
    category: placeholder.category,
    difficultyRange: { min: 1, max: 10 },
    component: PlaceholderComponent,
    available: false,
  };
  challengeRegistry.register(module);
}
