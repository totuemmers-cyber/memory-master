import { useParams, useSearchParams, useNavigate } from 'react-router';
import { challengeRegistry } from '../../engine/challenge-registry';
import { useGameStore } from '../../state/game-store';
import { useSound } from '../../hooks/useSound';
import type { ChallengeResult } from '../../types';
import { useCallback } from 'react';

export function ChallengeRunner() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordResult = useGameStore(s => s.recordChallengeResult);
  const sound = useSound();

  const module = id ? challengeRegistry.get(id) : undefined;
  const mode = (searchParams.get('mode') as 'daily' | 'free') || 'free';
  const slot = searchParams.get('slot') ? (parseInt(searchParams.get('slot')!) as 1 | 2 | 3) : undefined;
  const difficulty = parseInt(searchParams.get('difficulty') || '1');

  const handleComplete = useCallback((result: ChallengeResult) => {
    if (!module) return;
    const newAchievements = recordResult(module.id, module.category, result, mode, slot);
    if (newAchievements.length > 0) {
      sound.playAchievement();
    }
  }, [module, mode, slot, recordResult, sound]);

  const handleQuit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-pixel-red font-pixel text-pixel-sm">Challenge nicht gefunden</div>
      </div>
    );
  }

  const ChallengeComponent = module.component;

  return (
    <div className="min-h-screen bg-pixel-dark">
      <ChallengeComponent
        difficulty={difficulty}
        mode={mode}
        dailySlot={slot}
        onComplete={handleComplete}
        onQuit={handleQuit}
      />
    </div>
  );
}
