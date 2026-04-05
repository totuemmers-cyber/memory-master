import { challengeRegistry } from '../../engine/challenge-registry';
import { StoryRecall } from './StoryRecall';
import type { ChallengeModule } from '../../types';

const storyRecallModule: ChallengeModule = {
  id: 'story-recall',
  name: 'Story Recall',
  nameDE: 'Story Recall',
  description: 'Train your reading comprehension',
  icon: '📖',
  category: 'narrative',
  difficultyRange: { min: 1, max: 10 },
  component: StoryRecall,
  available: true,
};

challengeRegistry.register(storyRecallModule);
export default storyRecallModule;
