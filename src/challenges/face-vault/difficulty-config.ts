export interface FaceVaultDifficulty {
  level: number;
  faceCount: number;
  viewingTime: number; // seconds
  recallFormat: 'multipleChoice';
  extraQuestions: number; // attribute questions like "Who had glasses?"
}

export const DIFFICULTY_LEVELS: FaceVaultDifficulty[] = [
  { level: 1,  faceCount: 2, viewingTime: 15, recallFormat: 'multipleChoice', extraQuestions: 0 },
  { level: 2,  faceCount: 3, viewingTime: 15, recallFormat: 'multipleChoice', extraQuestions: 0 },
  { level: 3,  faceCount: 3, viewingTime: 13, recallFormat: 'multipleChoice', extraQuestions: 1 },
  { level: 4,  faceCount: 4, viewingTime: 12, recallFormat: 'multipleChoice', extraQuestions: 1 },
  { level: 5,  faceCount: 4, viewingTime: 11, recallFormat: 'multipleChoice', extraQuestions: 2 },
  { level: 6,  faceCount: 5, viewingTime: 10, recallFormat: 'multipleChoice', extraQuestions: 2 },
  { level: 7,  faceCount: 6, viewingTime: 10, recallFormat: 'multipleChoice', extraQuestions: 2 },
  { level: 8,  faceCount: 7, viewingTime: 9,  recallFormat: 'multipleChoice', extraQuestions: 3 },
  { level: 9,  faceCount: 8, viewingTime: 8,  recallFormat: 'multipleChoice', extraQuestions: 3 },
  { level: 10, faceCount: 9, viewingTime: 7,  recallFormat: 'multipleChoice', extraQuestions: 4 },
];

export function getDifficultyConfig(level: number): FaceVaultDifficulty {
  const clamped = Math.max(1, Math.min(10, level));
  return DIFFICULTY_LEVELS[clamped - 1];
}
