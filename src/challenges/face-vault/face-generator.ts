import type { FaceData, HeadShape, SkinTone, HairStyle, HairColor, EyeStyle, Accessory } from './types';

const NAMES = [
  'Alex', 'Maya', 'Sam', 'Lena', 'Kai', 'Nina', 'Ravi', 'Zoe',
  'Omar', 'Isla', 'Jude', 'Mila', 'Theo', 'Aria', 'Felix', 'Ivy',
  'Leo', 'Rosa', 'Nico', 'Tara', 'Eli', 'Dana', 'Hugo', 'Vera',
  'Jay', 'Luna', 'Owen', 'Nora', 'Ash', 'Faye', 'Remy', 'Cora',
  'Dex', 'Iris', 'Finn', 'Elle', 'Axel', 'Ruth', 'Beau', 'Wren',
];

const HEAD_SHAPES: HeadShape[] = ['round', 'oval', 'square'];
const SKIN_TONES: SkinTone[] = ['light', 'fair', 'medium', 'olive', 'brown', 'dark'];
const HAIR_STYLES: HairStyle[] = ['short', 'long', 'curly', 'bald', 'ponytail', 'spiky', 'bob', 'mohawk'];
const HAIR_COLORS: HairColor[] = ['black', 'brown', 'blonde', 'red', 'gray', 'blue'];
const EYE_STYLES: EyeStyle[] = ['round', 'narrow', 'wide', 'almond'];
const ACCESSORIES: Accessory[] = ['none', 'glasses', 'hat', 'earring'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Count how many visible traits differ between two faces */
function visibleDifferences(a: FaceData, b: FaceData): number {
  let diff = 0;
  if (a.headShape !== b.headShape) diff++;
  if (a.skinTone !== b.skinTone) diff++;
  if (a.hairStyle !== b.hairStyle) diff++;
  if (a.hairColor !== b.hairColor) diff++;
  if (a.eyeStyle !== b.eyeStyle) diff++;
  if (a.accessory !== b.accessory) diff++;
  return diff;
}

function generateSingleFace(id: string, name: string): FaceData {
  return {
    id,
    name,
    headShape: pick(HEAD_SHAPES),
    skinTone: pick(SKIN_TONES),
    hairStyle: pick(HAIR_STYLES),
    hairColor: pick(HAIR_COLORS),
    eyeStyle: pick(EYE_STYLES),
    accessory: pick(ACCESSORIES),
  };
}

export function generateFaces(count: number): FaceData[] {
  const usedNames = shuffle(NAMES).slice(0, count);
  const faces: FaceData[] = [];
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let attempt = 0;
    let candidate: FaceData;

    do {
      candidate = generateSingleFace(`face-${i}`, usedNames[i]);
      attempt++;

      // Check that candidate differs from all existing faces in at least 2 visible traits
      const tooSimilar = faces.some(f => visibleDifferences(f, candidate) < 2);
      if (!tooSimilar) break;
    } while (attempt < maxAttempts);

    faces.push(candidate);
  }

  return faces;
}
