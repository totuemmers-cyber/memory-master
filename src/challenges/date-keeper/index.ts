import { challengeRegistry } from '../../engine/challenge-registry';
import { DateKeeper } from './DateKeeper';
import type { ChallengeModule } from '../../types';

const dateKeeperModule: ChallengeModule = {
  id: 'date-keeper',
  name: 'Date Keeper',
  nameDE: 'Date Keeper',
  description: 'Memorize dates and events',
  icon: '📅',
  category: 'numerical',
  difficultyRange: { min: 1, max: 10 },
  component: DateKeeper,
  available: true,
};

challengeRegistry.register(dateKeeperModule);
export default dateKeeperModule;
