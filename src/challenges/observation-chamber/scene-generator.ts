import { ALL_SHAPES, ALL_COLORS, ALL_SIZES, SIZE_RADIUS, SCENE_WIDTH, SCENE_HEIGHT } from './types';
import type { SceneObject, Scene, Shape, ObjectColor, Size, Quadrant } from './types';
import type { DifficultyLevel } from './difficulty-config';
import { pickN, pickOne, shuffle } from '../../utils/random';

const MARGIN = 12;
const EDGE_INSET = 8;

function getQuadrant(x: number, y: number): Quadrant {
  const midX = SCENE_WIDTH / 2;
  const midY = SCENE_HEIGHT / 2;
  if (x < midX) return y < midY ? 'top-left' : 'bottom-left';
  return y < midY ? 'top-right' : 'bottom-right';
}

function hasCollision(x: number, y: number, r: number, placed: SceneObject[]): boolean {
  for (const obj of placed) {
    const objR = SIZE_RADIUS[obj.size];
    const dx = x - obj.x;
    const dy = y - obj.y;
    const minDist = r + objR + MARGIN;
    if (dx * dx + dy * dy < minDist * minDist) return true;
  }
  return false;
}

export function generateScene(config: DifficultyLevel): Scene {
  const availableShapes = ALL_SHAPES.slice(0, config.shapesAvailable);
  const availableColors = ALL_COLORS.slice(0, config.colorsAvailable);
  const availableSizes = config.sizesAvailable === 1
    ? ['medium' as Size]
    : config.sizesAvailable === 2
      ? ['small' as Size, 'large' as Size]
      : ALL_SIZES.slice();

  for (let restart = 0; restart < 5; restart++) {
    const objects = generateAttributes(config.objectCount, availableShapes, availableColors, availableSizes);
    const placed = placeObjects(objects);
    if (placed) {
      return { objects: placed, width: SCENE_WIDTH, height: SCENE_HEIGHT };
    }
  }

  // Fallback: reduce margin and try once more
  const objects = generateAttributes(config.objectCount, availableShapes, availableColors, availableSizes);
  const placed = placeObjectsFallback(objects);
  return { objects: placed, width: SCENE_WIDTH, height: SCENE_HEIGHT };
}

function generateAttributes(
  count: number,
  shapes: Shape[],
  colors: ObjectColor[],
  sizes: Size[]
): Array<{ shape: Shape; color: ObjectColor; size: Size }> {
  const result: Array<{ shape: Shape; color: ObjectColor; size: Size }> = [];

  // Ensure at least 2 distinct colors and 2 distinct shapes
  const forcedColors = pickN(colors, Math.min(2, colors.length));
  const forcedShapes = pickN(shapes, Math.min(2, shapes.length));

  // First objects use forced diversity
  for (let i = 0; i < count; i++) {
    let shape: Shape, color: ObjectColor, size: Size;
    if (i < forcedShapes.length) {
      shape = forcedShapes[i];
    } else {
      shape = pickOne(shapes);
    }
    if (i < forcedColors.length) {
      color = forcedColors[i];
    } else {
      color = pickOne(colors);
    }
    size = pickOne(sizes);
    result.push({ shape, color, size });
  }

  // Check no single attribute exceeds 40%
  const maxCount = Math.ceil(count * 0.4);
  const colorCounts = new Map<ObjectColor, number>();
  const shapeCounts = new Map<Shape, number>();
  for (const obj of result) {
    colorCounts.set(obj.color, (colorCounts.get(obj.color) || 0) + 1);
    shapeCounts.set(obj.shape, (shapeCounts.get(obj.shape) || 0) + 1);
  }

  // Fix over-represented attributes
  for (let i = 2; i < result.length; i++) {
    const cc = colorCounts.get(result[i].color) || 0;
    if (cc > maxCount) {
      const newColor = pickOne(colors.filter(c => (colorCounts.get(c) || 0) < maxCount));
      if (newColor) {
        colorCounts.set(result[i].color, cc - 1);
        result[i].color = newColor;
        colorCounts.set(newColor, (colorCounts.get(newColor) || 0) + 1);
      }
    }
    const sc = shapeCounts.get(result[i].shape) || 0;
    if (sc > maxCount) {
      const newShape = pickOne(shapes.filter(s => (shapeCounts.get(s) || 0) < maxCount));
      if (newShape) {
        shapeCounts.set(result[i].shape, sc - 1);
        result[i].shape = newShape;
        shapeCounts.set(newShape, (shapeCounts.get(newShape) || 0) + 1);
      }
    }
  }

  return shuffle(result);
}

function placeObjects(objects: Array<{ shape: Shape; color: ObjectColor; size: Size }>): SceneObject[] | null {
  // Sort largest first for easier placement
  const sorted = [...objects].sort((a, b) => SIZE_RADIUS[b.size] - SIZE_RADIUS[a.size]);
  const placed: SceneObject[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const obj = sorted[i];
    const r = SIZE_RADIUS[obj.size];
    const minX = r + EDGE_INSET;
    const maxX = SCENE_WIDTH - r - EDGE_INSET;
    const minY = r + EDGE_INSET;
    const maxY = SCENE_HEIGHT - r - EDGE_INSET;
    let foundSpot = false;

    for (let attempt = 0; attempt < 200; attempt++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      if (!hasCollision(x, y, r, placed)) {
        placed.push({
          id: `obj-${i}`,
          shape: obj.shape,
          color: obj.color,
          size: obj.size,
          x: Math.round(x),
          y: Math.round(y),
          quadrant: getQuadrant(x, y),
        });
        foundSpot = true;
        break;
      }
    }

    if (!foundSpot) return null;
  }

  return placed;
}

function placeObjectsFallback(objects: Array<{ shape: Shape; color: ObjectColor; size: Size }>): SceneObject[] {
  // Grid-based placement as ultimate fallback
  const cols = Math.ceil(Math.sqrt(objects.length));
  const rows = Math.ceil(objects.length / cols);
  const cellW = SCENE_WIDTH / cols;
  const cellH = SCENE_HEIGHT / rows;

  return objects.map((obj, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = Math.round(cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.3);
    const y = Math.round(cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.3);
    return {
      id: `obj-${i}`,
      shape: obj.shape,
      color: obj.color,
      size: obj.size,
      x: Math.max(SIZE_RADIUS[obj.size], Math.min(SCENE_WIDTH - SIZE_RADIUS[obj.size], x)),
      y: Math.max(SIZE_RADIUS[obj.size], Math.min(SCENE_HEIGHT - SIZE_RADIUS[obj.size], y)),
      quadrant: getQuadrant(x, y),
    };
  });
}
