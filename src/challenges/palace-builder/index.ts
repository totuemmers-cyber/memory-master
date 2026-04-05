import { challengeRegistry } from '../../engine/challenge-registry';
import { PalaceBuilder } from './PalaceBuilder';
import type { ChallengeModule } from '../../types';

const palaceBuilderModule: ChallengeModule = {
  id: 'palace-builder',
  name: 'Palace Builder',
  nameDE: 'Palace Builder',
  description: 'Use the method of loci',
  icon: '🏰',
  category: 'spatial',
  difficultyRange: { min: 1, max: 10 },
  component: PalaceBuilder,
  available: true,
};

challengeRegistry.register(palaceBuilderModule);
export default palaceBuilderModule;
