export interface LinkChainDifficulty {
  level: number;
  wordCount: number;
  distractorCount: number;
  viewingTime: number; // seconds
}

export const DIFFICULTY_LEVELS: LinkChainDifficulty[] = [
  { level: 1,  wordCount: 3,  distractorCount: 0, viewingTime: 12 },
  { level: 2,  wordCount: 4,  distractorCount: 0, viewingTime: 12 },
  { level: 3,  wordCount: 5,  distractorCount: 1, viewingTime: 11 },
  { level: 4,  wordCount: 5,  distractorCount: 2, viewingTime: 10 },
  { level: 5,  wordCount: 6,  distractorCount: 2, viewingTime: 10 },
  { level: 6,  wordCount: 7,  distractorCount: 3, viewingTime: 9 },
  { level: 7,  wordCount: 8,  distractorCount: 3, viewingTime: 9 },
  { level: 8,  wordCount: 9,  distractorCount: 4, viewingTime: 8 },
  { level: 9,  wordCount: 10, distractorCount: 5, viewingTime: 7 },
  { level: 10, wordCount: 12, distractorCount: 6, viewingTime: 7 },
];

export function getDifficultyConfig(level: number): LinkChainDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
