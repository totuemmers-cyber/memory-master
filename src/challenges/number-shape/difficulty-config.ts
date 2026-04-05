export interface NumberShapeDifficulty {
  level: number;
  digitCount: number;
  viewingTime: number; // seconds
}

export const DIFFICULTY_LEVELS: NumberShapeDifficulty[] = [
  { level: 1,  digitCount: 4,  viewingTime: 10 },
  { level: 2,  digitCount: 5,  viewingTime: 10 },
  { level: 3,  digitCount: 6,  viewingTime: 9 },
  { level: 4,  digitCount: 7,  viewingTime: 8 },
  { level: 5,  digitCount: 8,  viewingTime: 7 },
  { level: 6,  digitCount: 9,  viewingTime: 7 },
  { level: 7,  digitCount: 10, viewingTime: 6 },
  { level: 8,  digitCount: 12, viewingTime: 6 },
  { level: 9,  digitCount: 14, viewingTime: 5 },
  { level: 10, digitCount: 16, viewingTime: 5 },
];

export function getDifficultyConfig(level: number): NumberShapeDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
