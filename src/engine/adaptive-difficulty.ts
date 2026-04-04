import type { DifficultyRecord } from '../types';

interface AdaptiveConfig {
  upThreshold: number;
  downThreshold: number;
  consecutiveUpNeeded: number;
  consecutiveDownNeeded: number;
  maxDifficulty: number;
  minDifficulty: number;
}

const DEFAULT_CONFIG: AdaptiveConfig = {
  upThreshold: 85,
  downThreshold: 50,
  consecutiveUpNeeded: 3,
  consecutiveDownNeeded: 2,
  maxDifficulty: 10,
  minDifficulty: 1,
};

export function calculateNewDifficulty(
  currentDifficulty: number,
  recentScores: DifficultyRecord[],
  config: AdaptiveConfig = DEFAULT_CONFIG
): { newDifficulty: number; reason: 'up' | 'down' | 'stable' } {
  const atCurrentLevel = recentScores.filter(r => r.difficulty === currentDifficulty);

  if (atCurrentLevel.length < config.consecutiveDownNeeded) {
    return { newDifficulty: currentDifficulty, reason: 'stable' };
  }

  // Check for level up
  const lastUp = atCurrentLevel.slice(0, config.consecutiveUpNeeded);
  if (
    lastUp.length >= config.consecutiveUpNeeded &&
    lastUp.every(r => r.score >= config.upThreshold)
  ) {
    const next = Math.min(currentDifficulty + 1, config.maxDifficulty);
    return { newDifficulty: next, reason: next > currentDifficulty ? 'up' : 'stable' };
  }

  // Check for level down
  const lastDown = atCurrentLevel.slice(0, config.consecutiveDownNeeded);
  if (
    lastDown.length >= config.consecutiveDownNeeded &&
    lastDown.every(r => r.score < config.downThreshold)
  ) {
    const prev = Math.max(currentDifficulty - 1, config.minDifficulty);
    return { newDifficulty: prev, reason: prev < currentDifficulty ? 'down' : 'stable' };
  }

  return { newDifficulty: currentDifficulty, reason: 'stable' };
}
