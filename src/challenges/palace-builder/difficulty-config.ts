export interface PalaceDifficulty {
  level: number;
  roomCount: number;
  itemCount: number;
  viewingTime: number; // seconds
  questionCount: number;
}

export const DIFFICULTY_LEVELS: PalaceDifficulty[] = [
  { level: 1,  roomCount: 3, itemCount: 3,  viewingTime: 15, questionCount: 3 },
  { level: 2,  roomCount: 3, itemCount: 4,  viewingTime: 14, questionCount: 3 },
  { level: 3,  roomCount: 4, itemCount: 5,  viewingTime: 13, questionCount: 4 },
  { level: 4,  roomCount: 4, itemCount: 6,  viewingTime: 12, questionCount: 4 },
  { level: 5,  roomCount: 5, itemCount: 7,  viewingTime: 11, questionCount: 5 },
  { level: 6,  roomCount: 5, itemCount: 8,  viewingTime: 10, questionCount: 5 },
  { level: 7,  roomCount: 6, itemCount: 10, viewingTime: 10, questionCount: 6 },
  { level: 8,  roomCount: 7, itemCount: 12, viewingTime: 9,  questionCount: 7 },
  { level: 9,  roomCount: 8, itemCount: 14, viewingTime: 8,  questionCount: 7 },
  { level: 10, roomCount: 9, itemCount: 16, viewingTime: 7,  questionCount: 8 },
];

export function getDifficultyConfig(level: number): PalaceDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
