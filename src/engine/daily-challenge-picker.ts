import type { DailyState, DailyChallenge } from '../types';
import type { ChallengeCategory } from '../types';
import { challengeRegistry } from './challenge-registry';
import { getTodayString } from '../utils/date';

export function pickDailyChallenges(
  categoryDifficulties: Partial<Record<ChallengeCategory, number>>,
  currentDailyState: DailyState
): DailyState {
  const today = getTodayString();

  if (currentDailyState.date === today && currentDailyState.challenges.length === 3) {
    return currentDailyState;
  }

  const available = challengeRegistry.getAvailable();
  if (available.length === 0) {
    return { date: today, challenges: [], completed: [false, false, false] };
  }

  const challenges: DailyChallenge[] = [];

  if (available.length === 1) {
    const challenge = available[0];
    const currentDiff = categoryDifficulties[challenge.category] || 1;

    challenges.push({
      challengeId: challenge.id,
      difficulty: Math.max(1, currentDiff - 1),
      slot: 1,
      category: challenge.category,
    });
    challenges.push({
      challengeId: challenge.id,
      difficulty: currentDiff,
      slot: 2,
      category: challenge.category,
    });
    challenges.push({
      challengeId: challenge.id,
      difficulty: Math.min(10, currentDiff + 1),
      slot: 3,
      category: challenge.category,
    });
  } else {
    const ranked = available
      .map(c => ({ challenge: c, diff: categoryDifficulties[c.category] || 1 }))
      .sort((a, b) => a.diff - b.diff);

    const weakest = ranked[0];
    const strongest = ranked[ranked.length - 1];
    const middle = ranked[Math.floor(ranked.length / 2)];

    challenges.push({
      challengeId: weakest.challenge.id,
      difficulty: weakest.diff,
      slot: 1,
      category: weakest.challenge.category,
    });
    challenges.push({
      challengeId: middle.challenge.id,
      difficulty: middle.diff,
      slot: 2,
      category: middle.challenge.category,
    });
    challenges.push({
      challengeId: strongest.challenge.id,
      difficulty: Math.min(10, strongest.diff + 1),
      slot: 3,
      category: strongest.challenge.category,
    });
  }

  return { date: today, challenges, completed: [false, false, false] };
}
