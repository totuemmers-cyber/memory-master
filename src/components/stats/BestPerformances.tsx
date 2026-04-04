import { useGameStore } from '../../state/game-store';
import { challengeRegistry } from '../../engine/challenge-registry';
import { cn } from '../../utils/cn';

export function BestPerformances() {
  const history = useGameStore(s => s.history);

  // Group by challenge, find best
  const byChallenge = new Map<string, { bestScore: number; bestDifficulty: number; totalSessions: number }>();
  for (const r of history) {
    const existing = byChallenge.get(r.challengeId) || { bestScore: 0, bestDifficulty: 0, totalSessions: 0 };
    existing.bestScore = Math.max(existing.bestScore, r.result.score);
    existing.bestDifficulty = Math.max(existing.bestDifficulty, r.result.difficulty);
    existing.totalSessions++;
    byChallenge.set(r.challengeId, existing);
  }

  return (
    <div className="mb-8">
      <h2 className="text-pixel-sm text-white mb-4">Best Performances</h2>
      <div className="space-y-3">
        {[...byChallenge.entries()].map(([challengeId, stats]) => {
          const module = challengeRegistry.get(challengeId);
          return (
            <div key={challengeId} className="bg-pixel-surface p-4 pixel-border-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{module?.icon || '?'}</span>
                  <div>
                    <div className="text-white text-pixel-sm">{module?.nameDE || challengeId}</div>
                    <div className="text-pixel-muted text-pixel-xs mt-1">{stats.totalSessions} Sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-pixel-sm font-pixel',
                    stats.bestScore >= 85 ? 'text-pixel-emerald' : stats.bestScore >= 50 ? 'text-pixel-gold' : 'text-pixel-red'
                  )}>
                    {stats.bestScore}%
                  </div>
                  <div className="text-pixel-muted text-pixel-xs mt-1">Lv.{stats.bestDifficulty}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
