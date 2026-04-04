export type TitleRequirement =
  | { type: 'default' }
  | { type: 'any_category_difficulty'; difficulty: number }
  | { type: 'challenges_unlocked'; count: number }
  | { type: 'avg_difficulty'; minAvg: number }
  | { type: 'all_categories_min'; minDifficulty: number };

export interface Title {
  id: string;
  name: string;
  nameEN: string;
  rank: number;
  requirement: TitleRequirement;
  description: string;
}
