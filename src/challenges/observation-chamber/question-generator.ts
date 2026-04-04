import type { Scene, SceneObject, Question, QuestionType, ObjectColor, Shape, Size } from './types';
import type { DifficultyLevel } from './difficulty-config';
import { COLOR_LABELS, SHAPE_LABELS, SIZE_LABELS, QUADRANT_LABELS, SCENE_WIDTH, SCENE_HEIGHT } from './types';
import { shuffle } from '../../utils/random';
import { generateNumericDistractors, generateColorDistractors } from './distractor-generator';

interface QuestionCandidate {
  question: Question;
  interestingness: number;
}

export function generateQuestions(scene: Scene, config: DifficultyLevel): Question[] {
  const pool: QuestionCandidate[] = [];

  for (const type of config.questionTypes) {
    const candidates = generateCandidatesForType(type, scene, config);
    pool.push(...candidates);
  }

  // Select questions: variety + interestingness
  return selectQuestions(pool, config.questionCount);
}

function selectQuestions(pool: QuestionCandidate[], count: number): Question[] {
  if (pool.length <= count) return pool.map(c => c.question);

  // Sort by interestingness descending
  pool.sort((a, b) => b.interestingness - a.interestingness);

  const selected: Question[] = [];
  const typeCounts = new Map<QuestionType, number>();

  for (const candidate of pool) {
    if (selected.length >= count) break;

    const typeCount = typeCounts.get(candidate.question.type) || 0;
    if (typeCount >= 2) continue;

    typeCounts.set(candidate.question.type, typeCount + 1);
    selected.push(candidate.question);
  }

  // Fill remaining slots if needed
  if (selected.length < count) {
    for (const candidate of pool) {
      if (selected.length >= count) break;
      if (!selected.find(q => q.id === candidate.question.id)) {
        selected.push(candidate.question);
      }
    }
  }

  return shuffle(selected);
}

function generateCandidatesForType(type: QuestionType, scene: Scene, config: DifficultyLevel): QuestionCandidate[] {
  switch (type) {
    case 'totalCount': return generateTotalCountQuestions(scene);
    case 'count': return generateCountQuestions(scene);
    case 'existence': return generateExistenceQuestions(scene, config);
    case 'color': return generateColorQuestions(scene);
    case 'size': return generateSizeQuestions(scene);
    case 'position': return generatePositionQuestions(scene);
    case 'relativePosition': return generateRelativePositionQuestions(scene);
    case 'combination': return generateCombinationQuestions(scene);
    default: return [];
  }
}

let qId = 0;
function nextId(): string { return `q-${++qId}`; }

function generateTotalCountQuestions(scene: Scene): QuestionCandidate[] {
  const count = scene.objects.length;
  return [{
    question: {
      id: nextId(),
      type: 'totalCount',
      text: 'How many objects were there?',
      correctAnswer: String(count),
      answerFormat: 'numberInput',
      min: 1,
      max: count + 5,
    },
    interestingness: 3,
  }];
}

function generateCountQuestions(scene: Scene): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];
  const colorCounts = new Map<ObjectColor, number>();
  const shapeCounts = new Map<Shape, number>();

  for (const obj of scene.objects) {
    colorCounts.set(obj.color, (colorCounts.get(obj.color) || 0) + 1);
    shapeCounts.set(obj.shape, (shapeCounts.get(obj.shape) || 0) + 1);
  }

  // Count by color
  for (const [color, count] of colorCounts) {
    const distractors = generateNumericDistractors(count, 3, 0, Math.min(scene.objects.length, count + 3));
    const options = shuffle([String(count), ...distractors.map(String)]);
    candidates.push({
      question: {
        id: nextId(),
        type: 'count',
        text: `How many ${COLOR_LABELS[color].toLowerCase()} objects were there?`,
        correctAnswer: String(count),
        answerFormat: 'multipleChoice',
        options,
      },
      interestingness: count >= 2 ? 5 : 3,
    });
  }

  // Count by shape
  for (const [shape, count] of shapeCounts) {
    const distractors = generateNumericDistractors(count, 3, 0, Math.min(scene.objects.length, count + 3));
    const options = shuffle([String(count), ...distractors.map(String)]);
    candidates.push({
      question: {
        id: nextId(),
        type: 'count',
        text: `How many ${SHAPE_LABELS[shape].toLowerCase()}s were there?`,
        correctAnswer: String(count),
        answerFormat: 'multipleChoice',
        options,
      },
      interestingness: count >= 2 ? 5 : 3,
    });
  }

  return candidates;
}

function generateExistenceQuestions(scene: Scene, _config: DifficultyLevel): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];
  const existingPairs = new Set(scene.objects.map(o => `${o.color}|${o.shape}`));
  const sceneColors = [...new Set(scene.objects.map(o => o.color))];
  const sceneShapes = [...new Set(scene.objects.map(o => o.shape))];

  // Yes questions
  for (const obj of scene.objects) {
    candidates.push({
      question: {
        id: nextId(),
        type: 'existence',
        text: `Was there a ${COLOR_LABELS[obj.color].toLowerCase()} ${SHAPE_LABELS[obj.shape].toLowerCase()}?`,
        correctAnswer: 'Yes',
        answerFormat: 'yesNo',
        options: ['Yes', 'No'],
      },
      interestingness: 4,
    });
  }

  // No questions (color exists, shape exists, but not together)
  for (const color of sceneColors) {
    for (const shape of sceneShapes) {
      if (!existingPairs.has(`${color}|${shape}`)) {
        candidates.push({
          question: {
            id: nextId(),
            type: 'existence',
            text: `Was there a ${COLOR_LABELS[color].toLowerCase()} ${SHAPE_LABELS[shape].toLowerCase()}?`,
            correctAnswer: 'No',
            answerFormat: 'yesNo',
            options: ['Yes', 'No'],
          },
          interestingness: 6, // Trickier because both attributes were present
        });
      }
    }
  }

  return candidates;
}

function generateColorQuestions(scene: Scene): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];
  const sceneColors = [...new Set(scene.objects.map(o => o.color))];

  // Find objects with unique (size, shape) combinations
  const sizeShapeCounts = new Map<string, SceneObject[]>();
  for (const obj of scene.objects) {
    const key = `${obj.size}|${obj.shape}`;
    const arr = sizeShapeCounts.get(key) || [];
    arr.push(obj);
    sizeShapeCounts.set(key, arr);
  }

  for (const [, objs] of sizeShapeCounts) {
    if (objs.length !== 1) continue;
    const obj = objs[0];
    const distractors = generateColorDistractors(obj.color, sceneColors, 3);
    const options = shuffle([COLOR_LABELS[obj.color], ...distractors]);
    candidates.push({
      question: {
        id: nextId(),
        type: 'color',
        text: `What color was the ${SIZE_LABELS[obj.size].toLowerCase()} ${SHAPE_LABELS[obj.shape].toLowerCase()}?`,
        correctAnswer: COLOR_LABELS[obj.color],
        answerFormat: 'multipleChoice',
        options,
      },
      interestingness: 6,
    });
  }

  return candidates;
}

function generateSizeQuestions(scene: Scene): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];

  // Find objects with unique (color, shape) combinations
  const colorShapeCounts = new Map<string, SceneObject[]>();
  for (const obj of scene.objects) {
    const key = `${obj.color}|${obj.shape}`;
    const arr = colorShapeCounts.get(key) || [];
    arr.push(obj);
    colorShapeCounts.set(key, arr);
  }

  for (const [, objs] of colorShapeCounts) {
    if (objs.length !== 1) continue;
    const obj = objs[0];
    const options = ['Small', 'Medium', 'Large'];
    candidates.push({
      question: {
        id: nextId(),
        type: 'size',
        text: `What size was the ${COLOR_LABELS[obj.color].toLowerCase()} ${SHAPE_LABELS[obj.shape].toLowerCase()}?`,
        correctAnswer: SIZE_LABELS[obj.size],
        answerFormat: 'multipleChoice',
        options,
      },
      interestingness: 5,
    });
  }

  return candidates;
}

function generatePositionQuestions(scene: Scene): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];
  const midX = SCENE_WIDTH / 2;
  const midY = SCENE_HEIGHT / 2;
  const clearance = 40; // Object must be this far from center lines

  // Find uniquely identifiable objects that are clearly in their quadrant
  const colorShapeCounts = new Map<string, SceneObject[]>();
  for (const obj of scene.objects) {
    const key = `${obj.color}|${obj.shape}`;
    const arr = colorShapeCounts.get(key) || [];
    arr.push(obj);
    colorShapeCounts.set(key, arr);
  }

  for (const [, objs] of colorShapeCounts) {
    if (objs.length !== 1) continue;
    const obj = objs[0];
    if (Math.abs(obj.x - midX) < clearance || Math.abs(obj.y - midY) < clearance) continue;

    const options = Object.values(QUADRANT_LABELS);
    candidates.push({
      question: {
        id: nextId(),
        type: 'position',
        text: `Where was the ${COLOR_LABELS[obj.color].toLowerCase()} ${SHAPE_LABELS[obj.shape].toLowerCase()}?`,
        correctAnswer: QUADRANT_LABELS[obj.quadrant],
        answerFormat: 'quadrantSelect',
        options,
      },
      interestingness: 7,
    });
  }

  return candidates;
}

function generateRelativePositionQuestions(scene: Scene): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];

  // Find uniquely identifiable object pairs
  const colorShapeCounts = new Map<string, SceneObject[]>();
  for (const obj of scene.objects) {
    const key = `${obj.color}|${obj.shape}`;
    const arr = colorShapeCounts.get(key) || [];
    arr.push(obj);
    colorShapeCounts.set(key, arr);
  }

  const uniqueObjects = [...colorShapeCounts.entries()]
    .filter(([, objs]) => objs.length === 1)
    .map(([, objs]) => objs[0]);

  for (let i = 0; i < uniqueObjects.length; i++) {
    for (let j = i + 1; j < uniqueObjects.length; j++) {
      const a = uniqueObjects[i];
      const b = uniqueObjects[j];
      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);

      if (Math.max(dx, dy) < 80) continue; // Too close

      let direction: string;
      if (dx > dy) {
        direction = a.x < b.x ? 'to the left of' : 'to the right of';
      } else {
        direction = a.y < b.y ? 'above' : 'below';
      }

      const nameA = `${COLOR_LABELS[a.color].toLowerCase()} ${SHAPE_LABELS[a.shape].toLowerCase()}`;
      const nameB = `${COLOR_LABELS[b.color].toLowerCase()} ${SHAPE_LABELS[b.shape].toLowerCase()}`;

      candidates.push({
        question: {
          id: nextId(),
          type: 'relativePosition',
          text: `Was the ${nameA} ${direction} the ${nameB}?`,
          correctAnswer: 'Yes',
          answerFormat: 'yesNo',
          options: ['Yes', 'No'],
        },
        interestingness: 7,
      });
    }
  }

  return candidates;
}

function generateCombinationQuestions(scene: Scene): QuestionCandidate[] {
  const candidates: QuestionCandidate[] = [];
  const sizes: Size[] = ['small', 'medium', 'large'];
  const sceneColors = [...new Set(scene.objects.map(o => o.color))];

  for (const size of sizes) {
    for (const color of sceneColors) {
      const count = scene.objects.filter(o => o.size === size && o.color === color).length;
      if (count === 0 && Math.random() > 0.3) continue; // Include some zero-answer questions

      candidates.push({
        question: {
          id: nextId(),
          type: 'combination',
          text: `How many ${SIZE_LABELS[size].toLowerCase()} ${COLOR_LABELS[color].toLowerCase()} objects were there?`,
          correctAnswer: String(count),
          answerFormat: 'numberInput',
          min: 0,
          max: Math.min(scene.objects.length, 10),
        },
        interestingness: count > 0 ? 6 : 4,
      });
    }
  }

  return candidates;
}
