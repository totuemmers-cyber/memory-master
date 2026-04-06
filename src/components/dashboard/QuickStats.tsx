import { useNavigate } from 'react-router';
import { useGameStore } from '../../state/game-store';
import { PixelCard } from '../ui/PixelCard';

export function QuickStats() {
  const navigate = useNavigate();
  const history = useGameStore(s => s.history);

  if (history.length === 0) {
    return (
      <div className="mb-6">
        <PixelCard>
          <div className="text-center py-2">
            <div className="text-pixel-gold text-pixel-sm mb-2">Welcome to Memory Master!</div>
            <div className="text-pixel-muted text-pixel-xs leading-relaxed">
              Start with today's daily challenges above, or try Free Training below to pick any challenge at your own pace.
            </div>
          </div>
        </PixelCard>
      </div>
    );
  }

  const recent = history.slice(-10);
  const avgScore = Math.round(recent.reduce((sum, r) => sum + r.result.score, 0) / recent.length);
  const bestScore = Math.max(...history.map(r => r.result.score));
  const maxDiff = Math.max(...history.map(r => r.result.difficulty));

  return (
    <div className="mb-6">
      <h2 className="text-pixel-sm text-white mb-3">Statistics</h2>
      <PixelCard onClick={() => navigate('/stats')}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-pixel-gold text-pixel-lg">{avgScore}%</div>
            <div className="text-pixel-muted text-pixel-xs mt-1">∅ Score</div>
          </div>
          <div>
            <div className="text-pixel-emerald text-pixel-lg">{bestScore}%</div>
            <div className="text-pixel-muted text-pixel-xs mt-1">Best Score</div>
          </div>
          <div>
            <div className="text-pixel-purple text-pixel-lg">Lv.{maxDiff}</div>
            <div className="text-pixel-muted text-pixel-xs mt-1">Max Level</div>
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
