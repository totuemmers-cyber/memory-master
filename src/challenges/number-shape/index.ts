import { challengeRegistry } from '../../engine/challenge-registry';
import { NumberShape } from './NumberShape';
import type { ChallengeModule } from '../../types';

const numberShapeModule: ChallengeModule = {
  id: 'number-shape',
  name: 'Number Shape',
  nameDE: 'Number Shape',
  description: 'Memorize number sequences',
  icon: '🔢',
  category: 'numerical',
  difficultyRange: { min: 1, max: 10 },
  component: NumberShape,
  available: true,
};

challengeRegistry.register(numberShapeModule);
export default numberShapeModule;
