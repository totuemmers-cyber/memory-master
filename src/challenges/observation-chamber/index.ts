import { challengeRegistry } from '../../engine/challenge-registry';
import { ObservationChamber } from './ObservationChamber';
import type { ChallengeModule } from '../../types';

const observationChamberModule: ChallengeModule = {
  id: 'observation-chamber',
  name: 'Observation Chamber',
  nameDE: 'Beobachtungskammer',
  description: 'Praege dir Objekte ein und beantworte Fragen',
  icon: '👁',
  category: 'observation',
  difficultyRange: { min: 1, max: 10 },
  component: ObservationChamber,
  available: true,
};

challengeRegistry.register(observationChamberModule);
export default observationChamberModule;
