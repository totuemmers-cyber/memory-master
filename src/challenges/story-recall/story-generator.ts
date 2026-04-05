import type { StoryDifficulty } from './difficulty-config';
import type { StoryQuestion, FilledStory } from './story-templates';
import { buildStory } from './story-templates';

export interface GeneratedStory {
  text: string;
  sentences: string[];
  questions: StoryQuestion[];
}

export function generateStory(config: StoryDifficulty): GeneratedStory {
  const story: FilledStory = buildStory(config.sentenceCount, config.questionCount);

  return {
    text: story.sentences.join(' '),
    sentences: story.sentences,
    questions: story.questions,
  };
}
