import type { Title } from '../types';

export const ALL_TITLES: Title[] = [
  {
    id: 'novice',
    name: 'Novice',
    nameEN: 'Novice',
    rank: 0,
    requirement: { type: 'default' },
    description: 'The journey begins',
  },
  {
    id: 'observer',
    name: 'Observer',
    nameEN: 'Observer',
    rank: 1,
    requirement: { type: 'any_category_difficulty', difficulty: 3 },
    description: 'Level 3 in any category',
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    nameEN: 'Apprentice',
    rank: 2,
    requirement: { type: 'any_category_difficulty', difficulty: 5 },
    description: 'Level 5 in any category',
  },
  {
    id: 'memory-adept',
    name: 'Memory Adept',
    nameEN: 'Memory Adept',
    rank: 4,
    requirement: { type: 'avg_difficulty', minAvg: 5 },
    description: 'Average level 5',
  },
  {
    id: 'memory-athlete',
    name: 'Memory Athlete',
    nameEN: 'Memory Athlete',
    rank: 5,
    requirement: { type: 'avg_difficulty', minAvg: 7 },
    description: 'Average level 7',
  },
  {
    id: 'grand-master-of-memory',
    name: 'Grand Master of Memory',
    nameEN: 'Grand Master of Memory',
    rank: 6,
    requirement: { type: 'all_categories_min', minDifficulty: 8 },
    description: 'All categories level 8+',
  },
];
