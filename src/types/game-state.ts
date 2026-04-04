import type { ChallengeCategory } from './challenge';

export interface GameState {
  version: number;
  profile: PlayerProfile;
  history: SessionRecord[];
  achievements: AchievementProgress[];
  dailyState: DailyState;
  settings: UserSettings;
}

export interface PlayerProfile {
  createdAt: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalSessions: number;
  categoryDifficulties: Partial<Record<ChallengeCategory, number>>;
  categoryHistory: Partial<Record<ChallengeCategory, DifficultyRecord[]>>;
}

export interface DifficultyRecord {
  score: number;
  difficulty: number;
  timestamp: number;
}

export interface DailyState {
  date: string;
  challenges: DailyChallenge[];
  completed: boolean[];
}

export interface DailyChallenge {
  challengeId: string;
  difficulty: number;
  slot: 1 | 2 | 3;
  category: ChallengeCategory;
  result?: import('./challenge').ChallengeResult;
}

export interface SessionRecord {
  id: string;
  challengeId: string;
  category: ChallengeCategory;
  result: import('./challenge').ChallengeResult;
  mode: 'daily' | 'free';
  date: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  soundVolume: number;
}

export interface AchievementProgress {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: number;
}
