export type Shape = 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'heart' | 'hexagon' | 'pentagon';
export type ObjectColor = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'pink' | 'cyan';
export type Size = 'small' | 'medium' | 'large';
export type Quadrant = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const ALL_SHAPES: Shape[] = ['circle', 'square', 'triangle', 'star', 'diamond', 'heart', 'hexagon', 'pentagon'];
export const ALL_COLORS: ObjectColor[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan'];
export const ALL_SIZES: Size[] = ['small', 'medium', 'large'];

export const SIZE_RADIUS: Record<Size, number> = { small: 20, medium: 35, large: 50 };
export const SCENE_WIDTH = 600;
export const SCENE_HEIGHT = 450;

export const COLOR_HEX: Record<ObjectColor, string> = {
  red: '#E53E3E',
  blue: '#3182CE',
  green: '#38A169',
  yellow: '#ECC94B',
  orange: '#ED8936',
  purple: '#805AD5',
  pink: '#ED64A6',
  cyan: '#00B5D8',
};

export const COLOR_LABELS_DE: Record<ObjectColor, string> = {
  red: 'Rot', blue: 'Blau', green: 'Gruen', yellow: 'Gelb',
  orange: 'Orange', purple: 'Lila', pink: 'Pink', cyan: 'Tuerkis',
};

export const SHAPE_LABELS_DE: Record<Shape, string> = {
  circle: 'Kreis', square: 'Quadrat', triangle: 'Dreieck', star: 'Stern',
  diamond: 'Raute', heart: 'Herz', hexagon: 'Sechseck', pentagon: 'Fuenfeck',
};

export const SIZE_LABELS_DE: Record<Size, string> = {
  small: 'Klein', medium: 'Mittel', large: 'Gross',
};

export const QUADRANT_LABELS_DE: Record<Quadrant, string> = {
  'top-left': 'Oben links', 'top-right': 'Oben rechts',
  'bottom-left': 'Unten links', 'bottom-right': 'Unten rechts',
};

export interface SceneObject {
  id: string;
  shape: Shape;
  color: ObjectColor;
  size: Size;
  x: number;
  y: number;
  quadrant: Quadrant;
}

export interface Scene {
  objects: SceneObject[];
  width: number;
  height: number;
}

export type QuestionType = 'count' | 'existence' | 'color' | 'position' | 'relativePosition' | 'totalCount' | 'size' | 'combination';

export type AnswerFormat = 'multipleChoice' | 'yesNo' | 'numberInput' | 'quadrantSelect';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  correctAnswer: string;
  answerFormat: AnswerFormat;
  options?: string[];
  min?: number;
  max?: number;
}

export interface AnsweredQuestion {
  question: Question;
  playerAnswer: string;
  isCorrect: boolean;
  timeTakenMs: number;
}

export type GamePhase = 'idle' | 'countdown' | 'viewing' | 'questions' | 'feedback' | 'results';
