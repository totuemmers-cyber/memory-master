import { useState } from 'react';
import { useNavigate } from 'react-router';
import { challengeRegistry } from '../../engine/challenge-registry';
import { useGameStore } from '../../state/game-store';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { ChallengeInfoButton } from '../ui/ChallengeInfoPopup';

export function FreeTrainingPicker() {
  const navigate = useNavigate();
  const categoryDiffs = useGameStore(s => s.profile.categoryDifficulties);
  const allChallenges = challengeRegistry.getAll();
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const handleStart = () => {
    if (selectedChallenge && selectedDifficulty) {
      navigate(`/challenge/${selectedChallenge}?mode=free&difficulty=${selectedDifficulty}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-pixel-gold text-pixel-xl text-center mb-6">Free Training</h1>

      <div className="space-y-3 mb-6">
        {allChallenges.map((ch) => (
          <PixelCard
            key={ch.id}
            variant={!ch.available ? 'locked' : selectedChallenge === ch.id ? 'highlight' : 'default'}
            onClick={() => ch.available && setSelectedChallenge(ch.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{ch.icon}</span>
              <div className="flex-1">
                <div className="text-white text-pixel-sm">{ch.nameDE}</div>
                <div className="text-pixel-muted text-pixel-xs mt-1">
                  {ch.available ? ch.description : 'Coming Soon'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChallengeInfoButton challengeId={ch.id} />
                {!ch.available && (
                  <span className="text-pixel-xs text-pixel-muted">🔒</span>
                )}
              </div>
            </div>
          </PixelCard>
        ))}
      </div>

      {selectedChallenge && (
        <div className="mb-6">
          <h2 className="text-pixel-sm text-white mb-3">Difficulty</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
              const currentLevel = categoryDiffs[challengeRegistry.get(selectedChallenge)?.category || 'observation'] || 1;
              return (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`w-10 h-10 font-pixel text-pixel-xs transition-all ${
                    selectedDifficulty === level
                      ? 'bg-pixel-gold text-pixel-dark'
                      : level === currentLevel
                        ? 'bg-pixel-surface text-pixel-gold pixel-border-muted'
                        : 'bg-pixel-surface text-pixel-muted hover:text-white'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          {selectedDifficulty && (
            <div className="text-center mt-4">
              <PixelButton onClick={handleStart} size="lg">Start Level {selectedDifficulty}</PixelButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
