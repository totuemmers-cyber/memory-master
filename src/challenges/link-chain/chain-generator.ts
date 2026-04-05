import { shuffle } from '../../utils/random';

// Built-in word list (no external dependency needed)
const WORDS = [
  'apple', 'bridge', 'castle', 'drum', 'eagle', 'flame', 'garden', 'hammer',
  'island', 'jungle', 'knife', 'lantern', 'mountain', 'needle', 'ocean', 'piano',
  'queen', 'river', 'sword', 'tower', 'umbrella', 'violin', 'whale', 'anchor',
  'balloon', 'candle', 'diamond', 'engine', 'feather', 'globe', 'helmet', 'icicle',
  'jewel', 'kettle', 'ladder', 'mirror', 'notebook', 'olive', 'pillow', 'rocket',
  'shadow', 'tunnel', 'venom', 'wagon', 'crystal', 'dragon', 'forest', 'guitar',
  'harbor', 'ivory', 'jacket', 'kingdom', 'lemon', 'marble', 'nugget', 'orchid',
  'pearl', 'quilt', 'ribbon', 'shelter', 'trophy', 'vessel', 'window', 'zipper',
  'arrow', 'basket', 'cloud', 'dolphin', 'emerald', 'falcon', 'glacier', 'horizon',
  'insect', 'jasmine', 'kite', 'lighthouse', 'magnet', 'nest', 'orbit', 'puzzle',
  'ruby', 'statue', 'tiger', 'uniform', 'volcano', 'walnut', 'compass', 'desert',
  'fossil', 'gravel', 'honey', 'iron', 'jungle', 'knot', 'lily', 'medal',
  'novel', 'onion', 'parrot', 'quartz', 'raven', 'spider', 'torch', 'velvet',
];

export function generateChain(wordCount: number, distractorCount: number): { chain: string[]; pool: string[] } {
  const shuffled = shuffle(WORDS);
  const chain = shuffled.slice(0, wordCount);
  const distractors = shuffled.slice(wordCount, wordCount + distractorCount);
  const pool = shuffle([...chain, ...distractors]);

  return { chain, pool };
}

export function scoreChain(playerOrder: string[], correctOrder: string[]): { correct: number; total: number; perPosition: boolean[] } {
  const perPosition = correctOrder.map((word, i) => playerOrder[i] === word);
  return {
    correct: perPosition.filter(Boolean).length,
    total: correctOrder.length,
    perPosition,
  };
}
