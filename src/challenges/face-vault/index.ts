import { challengeRegistry } from '../../engine/challenge-registry';
import { FaceVault } from './FaceVault';
import type { ChallengeModule } from '../../types';

const faceVaultModule: ChallengeModule = {
  id: 'face-vault',
  name: 'Face Vault',
  nameDE: 'Face Vault',
  description: 'Memorize faces and names',
  icon: '\uD83D\uDC64',
  category: 'social',
  difficultyRange: { min: 1, max: 10 },
  component: FaceVault,
  available: true,
};

challengeRegistry.register(faceVaultModule);
export default faceVaultModule;
