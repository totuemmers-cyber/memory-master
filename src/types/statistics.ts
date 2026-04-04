import type { ChallengeCategory } from './challenge';

export interface CategoryStats {
  category: ChallengeCategory;
  totalSessions: number;
  averageScore: number;
  averageDifficulty: number;
  bestScore: number;
  bestDifficulty: number;
  recentTrend: 'improving' | 'stable' | 'declining';
}

export interface StreakDay {
  date: string;
  completed: boolean;
  sessionsCount: number;
  averageScore: number;
}
