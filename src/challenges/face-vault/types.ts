export type HeadShape = 'round' | 'oval' | 'square';
export type SkinTone = 'light' | 'fair' | 'medium' | 'olive' | 'brown' | 'dark';
export type HairStyle = 'short' | 'long' | 'curly' | 'bald' | 'ponytail' | 'spiky' | 'bob' | 'mohawk';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'blue';
export type EyeStyle = 'round' | 'narrow' | 'wide' | 'almond';
export type Accessory = 'none' | 'glasses' | 'hat' | 'earring';

export interface FaceData {
  id: string;
  name: string;
  headShape: HeadShape;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeStyle: EyeStyle;
  accessory: Accessory;
}

export interface FaceQuestion {
  id: string;
  text: string;
  correctAnswer: string;
  options: string[];
  faceId?: string; // if showing a specific face with the question
}

export interface AnsweredFaceQuestion {
  question: FaceQuestion;
  playerAnswer: string;
  isCorrect: boolean;
  timeTakenMs: number;
}

export type FaceVaultPhase = 'idle' | 'countdown' | 'memorize' | 'recall' | 'results';
