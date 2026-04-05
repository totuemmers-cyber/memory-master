import type { FaceData, FaceQuestion } from './types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build 4 MC options: the correct answer + 3 distractors from the face name pool */
function buildNameOptions(correctName: string, allNames: string[]): string[] {
  const distractors = allNames.filter(n => n !== correctName);
  const picked = shuffle(distractors).slice(0, 3);
  return shuffle([correctName, ...picked]);
}

/**
 * Generate name-recall questions: one per face.
 * "What was this person's name?" — shows the face, 4 MC name options.
 */
export function generateNameQuestions(faces: FaceData[]): FaceQuestion[] {
  const allNames = faces.map(f => f.name);

  return shuffle(faces).map((face, i) => ({
    id: `name-q-${i}`,
    text: "What was this person's name?",
    correctAnswer: face.name,
    options: buildNameOptions(face.name, allNames),
    faceId: face.id,
  }));
}

/**
 * Attribute-based questions:
 * "Who had glasses?", "Who had blue hair?", "Who had a hat?", etc.
 */
export function generateAttributeQuestions(faces: FaceData[], count: number): FaceQuestion[] {
  if (count === 0) return [];

  const allNames = faces.map(f => f.name);
  const candidates: FaceQuestion[] = [];

  // Accessory questions
  const accessoryLabels: Record<string, string> = {
    glasses: 'glasses',
    hat: 'a hat',
    earring: 'an earring',
  };

  for (const face of faces) {
    if (face.accessory !== 'none') {
      candidates.push({
        id: `attr-acc-${face.id}`,
        text: `Who had ${accessoryLabels[face.accessory]}?`,
        correctAnswer: face.name,
        options: buildNameOptions(face.name, allNames),
      });
    }
  }

  // Hair color questions
  const hairColorLabels: Record<string, string> = {
    black: 'black',
    brown: 'brown',
    blonde: 'blonde',
    red: 'red',
    gray: 'gray',
    blue: 'blue',
  };

  for (const face of faces) {
    candidates.push({
      id: `attr-hair-${face.id}`,
      text: `Who had ${hairColorLabels[face.hairColor]} hair?`,
      correctAnswer: face.name,
      options: buildNameOptions(face.name, allNames),
    });
  }

  // Hair style questions
  const hairStyleLabels: Record<string, string> = {
    short: 'short hair',
    long: 'long hair',
    curly: 'curly hair',
    bald: 'no hair',
    ponytail: 'a ponytail',
    spiky: 'spiky hair',
    bob: 'a bob cut',
    mohawk: 'a mohawk',
  };

  for (const face of faces) {
    candidates.push({
      id: `attr-style-${face.id}`,
      text: `Who had ${hairStyleLabels[face.hairStyle]}?`,
      correctAnswer: face.name,
      options: buildNameOptions(face.name, allNames),
    });
  }

  // Skin tone question (only for distinctive tones)
  const toneLabels: Record<string, string> = {
    light: 'the lightest skin',
    dark: 'the darkest skin',
  };

  for (const face of faces) {
    if (face.skinTone in toneLabels) {
      // Only ask if this face is the only one with that tone
      const sameCount = faces.filter(f => f.skinTone === face.skinTone).length;
      if (sameCount === 1) {
        candidates.push({
          id: `attr-skin-${face.id}`,
          text: `Who had ${toneLabels[face.skinTone]}?`,
          correctAnswer: face.name,
          options: buildNameOptions(face.name, allNames),
        });
      }
    }
  }

  // Head shape questions
  const shapeLabels: Record<string, string> = {
    round: 'a round face',
    square: 'a square face',
    oval: 'an oval face',
  };

  for (const face of faces) {
    // Only ask if unique head shape
    const sameCount = faces.filter(f => f.headShape === face.headShape).length;
    if (sameCount === 1) {
      candidates.push({
        id: `attr-head-${face.id}`,
        text: `Who had ${shapeLabels[face.headShape]}?`,
        correctAnswer: face.name,
        options: buildNameOptions(face.name, allNames),
      });
    }
  }

  // Deduplicate by question text (keep first occurrence)
  const seen = new Set<string>();
  const unique = candidates.filter(q => {
    if (seen.has(q.text)) return false;
    seen.add(q.text);
    return true;
  });

  // Shuffle and return requested count
  return shuffle(unique).slice(0, count).map((q, i) => ({
    ...q,
    id: `attr-q-${i}`,
  }));
}
