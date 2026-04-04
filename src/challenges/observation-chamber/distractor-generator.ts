import type { ObjectColor } from './types';
import { ALL_COLORS, COLOR_LABELS } from './types';
import { shuffle } from '../../utils/random';

export function generateNumericDistractors(
  correct: number,
  count: number,
  min: number,
  max: number
): number[] {
  const candidates = new Set<number>();

  // Close values first
  for (let d = 1; d <= 3; d++) {
    if (correct + d <= max) candidates.add(correct + d);
    if (correct - d >= min) candidates.add(correct - d);
  }

  // Remove the correct answer
  candidates.delete(correct);

  // If we need more, add random values
  const maxPossible = max - min + 1 - 1; // total range minus the correct answer
  while (candidates.size < count + 2 && candidates.size < maxPossible) {
    const val = min + Math.floor(Math.random() * (max - min + 1));
    if (val !== correct) candidates.add(val);
  }

  return shuffle([...candidates]).slice(0, count);
}

export function generateColorDistractors(
  correctColor: ObjectColor,
  sceneColors: ObjectColor[],
  count: number
): string[] {
  // Prefer colors present in scene (more plausible)
  const sceneDistractors = sceneColors
    .filter(c => c !== correctColor)
    .map(c => COLOR_LABELS[c]);

  const allDistractors = ALL_COLORS
    .filter(c => c !== correctColor)
    .map(c => COLOR_LABELS[c]);

  const pool = [...new Set([...sceneDistractors, ...allDistractors])];
  return shuffle(pool).slice(0, count);
}
