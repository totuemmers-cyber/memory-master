import { challengeRegistry } from '../../engine/challenge-registry';
import { CardRecall } from './CardRecall';
import type { ChallengeModule } from '../../types';

const cardRecallModule: ChallengeModule = {
  id: 'card-recall',
  name: 'Card Recall',
  nameDE: 'Card Recall',
  description: 'Memorize card sequences',
  icon: '🃏',
  category: 'sequential',
  difficultyRange: { min: 1, max: 10 },
  component: CardRecall,
  available: true,
};

challengeRegistry.register(cardRecallModule);
export default cardRecallModule;
