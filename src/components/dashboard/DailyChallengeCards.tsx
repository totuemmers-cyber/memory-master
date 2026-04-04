import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGameStore } from '../../state/game-store';
import { pickDailyChallenges } from '../../engine/daily-challenge-picker';
import { challengeRegistry } from '../../engine/challenge-registry';
import { PixelCard } from '../ui/PixelCard';
import { PixelProgress } from '../ui/PixelProgress';
import { ChallengeInfoButton } from '../ui/ChallengeInfoPopup';

const SLOT_LABELS = ['Schwaeche', 'Balance', 'Herausforderung'];
const SLOT_COLORS = ['text-pixel-red', 'text-pixel-blue', 'text-pixel-gold'];

export function DailyChallengeCards() {
  const navigate = useNavigate();
  const dailyState = useGameStore(s => s.dailyState);
  const categoryDiffs = useGameStore(s => s.profile.categoryDifficulties);
  const setDailyChallenges = useGameStore(s => s.setDailyChallenges);

  // Initialize or refresh daily challenges
  useEffect(() => {
    const updated = pickDailyChallenges(categoryDiffs, dailyState);
    if (updated.date !== dailyState.date) {
      setDailyChallenges(updated);
    }
  }, []);

  if (dailyState.challenges.length === 0) return null;

  const completedCount = dailyState.completed.filter(Boolean).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-pixel-sm text-white">Taegliche Challenges</h2>
        <span className="text-pixel-xs text-pixel-muted">{completedCount}/3</span>
      </div>
      <PixelProgress value={(completedCount / 3) * 100} color="gold" className="mb-4" />
      <div className="space-y-3">
        {dailyState.challenges.map((dc, i) => {
          const module = challengeRegistry.get(dc.challengeId);
          const isCompleted = dailyState.completed[i];
          const result = dc.result;

          return (
            <PixelCard
              key={i}
              variant={isCompleted ? 'default' : 'highlight'}
              onClick={() => {
                if (!isCompleted) {
                  navigate(`/challenge/${dc.challengeId}?mode=daily&slot=${dc.slot}&difficulty=${dc.difficulty}`);
                }
              }}
              className={isCompleted ? 'opacity-60' : ''}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{module?.icon || '?'}</span>
                  <div>
                    <div className="text-white text-pixel-sm">
                      {module?.nameDE || module?.name || dc.challengeId}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-pixel-xs ${SLOT_COLORS[i]}`}>{SLOT_LABELS[i]}</span>
                      <span className="text-pixel-xs text-pixel-muted">Lv.{dc.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChallengeInfoButton challengeId={dc.challengeId} />
                  {isCompleted && result ? (
                    <span className={`text-pixel-sm font-pixel ${result.score >= 85 ? 'text-pixel-emerald' : result.score >= 50 ? 'text-pixel-gold' : 'text-pixel-red'}`}>
                      {result.score}%
                    </span>
                  ) : (
                    <span className="text-pixel-gold text-pixel-sm">▶</span>
                  )}
                </div>
              </div>
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
