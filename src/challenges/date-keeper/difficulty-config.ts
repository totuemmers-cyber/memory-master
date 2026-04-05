export interface DateKeeperDifficulty {
  level: number;
  eventCount: number;
  viewingTime: number; // seconds
  dateFormat: 'year' | 'monthYear' | 'full';
  recallFormat: 'multipleChoice' | 'dropdown';
}

export const DIFFICULTY_LEVELS: DateKeeperDifficulty[] = [
  { level: 1,  eventCount: 2, viewingTime: 15, dateFormat: 'year',      recallFormat: 'multipleChoice' },
  { level: 2,  eventCount: 3, viewingTime: 15, dateFormat: 'year',      recallFormat: 'multipleChoice' },
  { level: 3,  eventCount: 3, viewingTime: 14, dateFormat: 'monthYear', recallFormat: 'multipleChoice' },
  { level: 4,  eventCount: 4, viewingTime: 14, dateFormat: 'monthYear', recallFormat: 'multipleChoice' },
  { level: 5,  eventCount: 4, viewingTime: 12, dateFormat: 'full',      recallFormat: 'multipleChoice' },
  { level: 6,  eventCount: 5, viewingTime: 12, dateFormat: 'full',      recallFormat: 'multipleChoice' },
  { level: 7,  eventCount: 5, viewingTime: 10, dateFormat: 'full',      recallFormat: 'dropdown' },
  { level: 8,  eventCount: 6, viewingTime: 10, dateFormat: 'full',      recallFormat: 'dropdown' },
  { level: 9,  eventCount: 7, viewingTime: 9,  dateFormat: 'full',      recallFormat: 'dropdown' },
  { level: 10, eventCount: 8, viewingTime: 8,  dateFormat: 'full',      recallFormat: 'dropdown' },
];

export function getDifficultyConfig(level: number): DateKeeperDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
