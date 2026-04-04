import type { GameStore } from './game-store';
import type { CategoryStats, StreakDay } from '../types';
import type { ChallengeCategory } from '../types';
import { getLastNDays } from '../utils/date';

const TITLES = {
  novice: { id: 'novice', name: 'Novice', rank: 0 },
  observer: { id: 'observer', name: 'Observer', rank: 1 },
  apprentice: { id: 'apprentice', name: 'Apprentice', rank: 2 },
  memoryAdept: { id: 'memory-adept', name: 'Memory Adept', rank: 4 },
  memoryAthlete: { id: 'memory-athlete', name: 'Memory Athlete', rank: 5 },
  grandMaster: { id: 'grand-master-of-memory', name: 'Grand Master of Memory', rank: 6 },
} as const;

export function selectCurrentTitle(state: GameStore) {
  const diffs = state.profile.categoryDifficulties;
  const values = Object.values(diffs).filter((v): v is number => v !== undefined);

  if (values.length === 0) return TITLES.novice;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (values.length >= 7 && min >= 8) return TITLES.grandMaster;
  if (avg >= 7) return TITLES.memoryAthlete;
  if (avg >= 5) return TITLES.memoryAdept;
  if (max >= 5) return TITLES.apprentice;
  if (max >= 3) return TITLES.observer;
  return TITLES.novice;
}

export function selectCategoryStats(state: GameStore): CategoryStats[] {
  const byCategory = new Map<ChallengeCategory, typeof state.history>();

  for (const record of state.history) {
    const existing = byCategory.get(record.category) || [];
    existing.push(record);
    byCategory.set(record.category, existing);
  }

  return Array.from(byCategory.entries()).map(([category, records]) => {
    const scores = records.map(r => r.result.score);
    const diffs = records.map(r => r.result.difficulty);
    const recent = scores.slice(-5);
    const older = scores.slice(-10, -5);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;

    let recentTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg - olderAvg > 5) recentTrend = 'improving';
    else if (olderAvg - recentAvg > 5) recentTrend = 'declining';

    return {
      category,
      totalSessions: records.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      averageDifficulty: Math.round((diffs.reduce((a, b) => a + b, 0) / diffs.length) * 10) / 10,
      bestScore: Math.max(...scores),
      bestDifficulty: Math.max(...diffs),
      recentTrend,
    };
  });
}

export function selectStreakDays(state: GameStore, days: number = 90): StreakDay[] {
  const dayList = getLastNDays(days);
  return dayList.map(date => {
    const dayRecords = state.history.filter(r => r.date === date);
    const scores = dayRecords.map(r => r.result.score);
    return {
      date,
      completed: dayRecords.filter(r => r.mode === 'daily').length >= 3,
      sessionsCount: dayRecords.length,
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    };
  });
}
