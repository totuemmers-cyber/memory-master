import type { ComponentType } from 'react';

export type ChallengeCategory =
  | 'observation'
  | 'association'
  | 'spatial'
  | 'numerical'
  | 'social'
  | 'sequential'
  | 'narrative';

export interface ChallengeModule {
  id: string;
  name: string;
  nameDE: string;
  description: string;
  icon: string;
  category: ChallengeCategory;
  difficultyRange: { min: number; max: number };
  component: ComponentType<ChallengeProps>;
  available: boolean;
}

export interface ChallengeProps {
  difficulty: number;
  mode: 'daily' | 'free';
  dailySlot?: 1 | 2 | 3;
  onComplete: (result: ChallengeResult) => void;
  onQuit: () => void;
}

export interface ChallengeResult {
  challengeId: string;
  difficulty: number;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  timeUsed: number;
  timeAllowed: number;
  timestamp: number;
}
