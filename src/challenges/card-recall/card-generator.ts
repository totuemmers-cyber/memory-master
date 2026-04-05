import { shuffle } from '../../utils/random';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export interface Card {
  rank: string;
  suit: Suit;
}

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '\u2665',
  diamonds: '\u2666',
  clubs: '\u2663',
  spades: '\u2660',
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-white',
  spades: 'text-white',
};

export function cardId(card: Card): string {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

function buildFullDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function generateCardSequence(
  count: number,
  distractorCount: number
): { sequence: Card[]; pool: Card[] } {
  const deck = shuffle(buildFullDeck());
  const sequence = deck.slice(0, count);
  const distractors = deck.slice(count, count + distractorCount);
  const pool = shuffle([...sequence, ...distractors]);

  return { sequence, pool };
}

export function scoreCardSequence(
  playerOrder: Card[],
  correctOrder: Card[]
): { correct: number; total: number; perPosition: boolean[] } {
  const perPosition = correctOrder.map(
    (card, i) =>
      playerOrder[i] !== undefined &&
      playerOrder[i].rank === card.rank &&
      playerOrder[i].suit === card.suit
  );
  return {
    correct: perPosition.filter(Boolean).length,
    total: correctOrder.length,
    perPosition,
  };
}
