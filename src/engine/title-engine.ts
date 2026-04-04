import type { Title } from '../types';
import { ALL_TITLES } from '../data/titles';
import type { ChallengeCategory } from '../types';

export function getCurrentTitle(
  categoryDifficulties: Partial<Record<ChallengeCategory, number>>
): Title {
  const values = Object.values(categoryDifficulties).filter((v): v is number => v !== undefined);

  // Sort titles by rank descending, find the first one that matches
  const sorted = [...ALL_TITLES].sort((a, b) => b.rank - a.rank);

  for (const title of sorted) {
    const req = title.requirement;
    switch (req.type) {
      case 'all_categories_min': {
        if (values.length >= 7 && values.every(v => v >= req.minDifficulty)) return title;
        break;
      }
      case 'avg_difficulty': {
        if (values.length > 0) {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          if (avg >= req.minAvg) return title;
        }
        break;
      }
      case 'any_category_difficulty': {
        if (values.some(v => v >= req.difficulty)) return title;
        break;
      }
      case 'default':
        return title;
    }
  }

  return ALL_TITLES[0]; // Novice
}
