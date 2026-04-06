import type { GameState, SessionRecord } from '../types';
import type { ChallengeResult, Achievement } from '../types';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { challengeRegistry } from './challenge-registry';

export type AchievementEvent =
  | { type: 'challenge_completed'; result: ChallengeResult; record: SessionRecord }
  | { type: 'streak_updated'; streak: number }
  | { type: 'daily_all_completed' };

export function checkAchievements(
  state: GameState,
  event: AchievementEvent
): string[] {
  const newlyUnlocked: string[] = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    const alreadyUnlocked = state.achievements.find(
      a => a.achievementId === achievement.id && a.unlocked
    );
    if (alreadyUnlocked) continue;

    if (evaluateCondition(achievement, state, event)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
}

function evaluateCondition(
  achievement: Achievement,
  state: GameState,
  event: AchievementEvent
): boolean {
  const cond = achievement.condition;

  switch (cond.type) {
    case 'first_challenge':
      return state.history.length >= 1;

    case 'score_threshold':
      if (event.type !== 'challenge_completed') return false;
      return event.result.score >= cond.minScore && event.result.difficulty >= cond.minDifficulty;

    case 'total_above_score': {
      const count = state.history.filter(r => r.result.score >= cond.minScore).length;
      return count >= cond.count;
    }

    case 'day_streak':
      return state.profile.currentStreak >= cond.days;

    case 'difficulty_reached':
      if (event.type !== 'challenge_completed') return false;
      if (cond.challengeId && event.result.challengeId !== cond.challengeId) return false;
      return event.result.difficulty >= cond.difficulty;

    case 'total_sessions':
      return state.history.length >= cond.count;

    case 'all_challenges_played': {
      const availableIds = new Set(challengeRegistry.getAvailable().map(c => c.id));
      const playedIds = new Set(state.history.map(r => r.challengeId));
      for (const id of availableIds) {
        if (!playedIds.has(id)) return false;
      }
      return availableIds.size > 0;
    }

    default:
      return false;
  }
}
