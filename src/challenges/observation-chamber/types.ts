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

export const COLOR_LABELS: Record<ObjectColor, string> = {
  red: 'Red', blue: 'Blue', green: 'Green', yellow: 'Yellow',
  orange: 'Orange', purple: 'Purple', pink: 'Pink', cyan: 'Cyan',
};

export const SHAPE_LABELS: Record<Shape, string> = {
  circle: 'Circle', square: 'Square', triangle: 'Triangle', star: 'Star',
  diamond: 'Diamond', heart: 'Heart', hexagon: 'Hexagon', pentagon: 'Pentagon',
};

export const SIZE_LABELS: Record<Size, string> = {
  small: 'Small', medium: 'Medium', large: 'Large',
};

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  'top-left': 'Top left', 'top-right': 'Top right',
  'bottom-left': 'Bottom left', 'bottom-right': 'Bottom right',
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
