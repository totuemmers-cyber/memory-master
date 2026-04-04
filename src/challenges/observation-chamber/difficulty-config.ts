import type { QuestionType } from './types';

export interface DifficultyLevel {
  level: number;
  objectCount: number;
  viewingTime: number;
  questionCount: number;
  questionTypes: QuestionType[];
  shapesAvailable: number;
  colorsAvailable: number;
  sizesAvailable: number;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { level: 1,  objectCount: 4,  viewingTime: 20, questionCount: 3, questionTypes: ['count', 'existence', 'totalCount'], shapesAvailable: 3, colorsAvailable: 3, sizesAvailable: 1 },
  { level: 2,  objectCount: 5,  viewingTime: 18, questionCount: 3, questionTypes: ['count', 'existence', 'totalCount'], shapesAvailable: 4, colorsAvailable: 4, sizesAvailable: 2 },
  { level: 3,  objectCount: 6,  viewingTime: 16, questionCount: 4, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size'], shapesAvailable: 5, colorsAvailable: 5, sizesAvailable: 3 },
  { level: 4,  objectCount: 7,  viewingTime: 14, questionCount: 4, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size'], shapesAvailable: 5, colorsAvailable: 5, sizesAvailable: 3 },
  { level: 5,  objectCount: 8,  viewingTime: 12, questionCount: 5, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size', 'position'], shapesAvailable: 6, colorsAvailable: 6, sizesAvailable: 3 },
  { level: 6,  objectCount: 10, viewingTime: 11, questionCount: 5, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size', 'position'], shapesAvailable: 6, colorsAvailable: 6, sizesAvailable: 3 },
  { level: 7,  objectCount: 12, viewingTime: 10, questionCount: 6, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size', 'position', 'relativePosition'], shapesAvailable: 7, colorsAvailable: 7, sizesAvailable: 3 },
  { level: 8,  objectCount: 14, viewingTime: 9,  questionCount: 6, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size', 'position', 'relativePosition'], shapesAvailable: 8, colorsAvailable: 8, sizesAvailable: 3 },
  { level: 9,  objectCount: 17, viewingTime: 8,  questionCount: 7, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size', 'position', 'relativePosition', 'combination'], shapesAvailable: 8, colorsAvailable: 8, sizesAvailable: 3 },
  { level: 10, objectCount: 20, viewingTime: 7,  questionCount: 8, questionTypes: ['count', 'existence', 'totalCount', 'color', 'size', 'position', 'relativePosition', 'combination'], shapesAvailable: 8, colorsAvailable: 8, sizesAvailable: 3 },
];

export function getDifficultyConfig(level: number): DifficultyLevel {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
