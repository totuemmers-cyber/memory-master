export interface StoryDifficulty {
  level: number;
  sentenceCount: number;
  detailCount: number;
  questionCount: number;
  viewingTime: number; // seconds
}

export const DIFFICULTY_LEVELS: StoryDifficulty[] = [
  { level: 1,  sentenceCount: 3, detailCount: 3,  questionCount: 3, viewingTime: 30 },
  { level: 2,  sentenceCount: 3, detailCount: 4,  questionCount: 3, viewingTime: 28 },
  { level: 3,  sentenceCount: 4, detailCount: 5,  questionCount: 4, viewingTime: 26 },
  { level: 4,  sentenceCount: 5, detailCount: 6,  questionCount: 4, viewingTime: 24 },
  { level: 5,  sentenceCount: 5, detailCount: 7,  questionCount: 5, viewingTime: 22 },
  { level: 6,  sentenceCount: 6, detailCount: 8,  questionCount: 6, viewingTime: 20 },
  { level: 7,  sentenceCount: 6, detailCount: 9,  questionCount: 6, viewingTime: 18 },
  { level: 8,  sentenceCount: 7, detailCount: 10, questionCount: 7, viewingTime: 16 },
  { level: 9,  sentenceCount: 8, detailCount: 11, questionCount: 7, viewingTime: 15 },
  { level: 10, sentenceCount: 8, detailCount: 12, questionCount: 8, viewingTime: 14 },
];

export function getDifficultyConfig(level: number): StoryDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
