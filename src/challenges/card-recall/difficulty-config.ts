export interface CardRecallDifficulty {
  level: number;
  cardCount: number;
  distractorCount: number;
  viewingTime: number; // seconds
}

export const DIFFICULTY_LEVELS: CardRecallDifficulty[] = [
  { level: 1,  cardCount: 3,  distractorCount: 0, viewingTime: 12 },
  { level: 2,  cardCount: 4,  distractorCount: 0, viewingTime: 11 },
  { level: 3,  cardCount: 5,  distractorCount: 1, viewingTime: 11 },
  { level: 4,  cardCount: 5,  distractorCount: 2, viewingTime: 10 },
  { level: 5,  cardCount: 6,  distractorCount: 3, viewingTime: 9 },
  { level: 6,  cardCount: 7,  distractorCount: 4, viewingTime: 9 },
  { level: 7,  cardCount: 8,  distractorCount: 5, viewingTime: 8 },
  { level: 8,  cardCount: 9,  distractorCount: 6, viewingTime: 7 },
  { level: 9,  cardCount: 10, distractorCount: 7, viewingTime: 7 },
  { level: 10, cardCount: 12, distractorCount: 8, viewingTime: 6 },
];

export function getDifficultyConfig(level: number): CardRecallDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
