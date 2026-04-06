export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export type AchievementCondition =
  | { type: 'first_challenge' }
  | { type: 'score_threshold'; minScore: number; minDifficulty: number }
  | { type: 'total_above_score'; minScore: number; count: number }
  | { type: 'day_streak'; days: number }
  | { type: 'difficulty_reached'; difficulty: number; challengeId?: string }
  | { type: 'total_sessions'; count: number }
  | { type: 'all_challenges_played' };

export interface Achievement {
  id: string;
  name: string;
  nameEN: string;
  description: string;
  descriptionEN: string;
  icon: string;
  tier: AchievementTier;
  condition: AchievementCondition;
  secret?: boolean;
}
