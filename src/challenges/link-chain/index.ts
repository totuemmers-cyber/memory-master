import { challengeRegistry } from '../../engine/challenge-registry';
import { LinkChain } from './LinkChain';
import type { ChallengeModule } from '../../types';

const linkChainModule: ChallengeModule = {
  id: 'link-chain',
  name: 'Link Chain',
  nameDE: 'Link Chain',
  description: 'Link words into an association chain',
  icon: '🔗',
  category: 'association',
  difficultyRange: { min: 1, max: 10 },
  component: LinkChain,
  available: true,
};

challengeRegistry.register(linkChainModule);
export default linkChainModule;
