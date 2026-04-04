import type { ChallengeModule, ChallengeCategory } from '../types';

class ChallengeRegistry {
  private modules: Map<string, ChallengeModule> = new Map();

  register(module: ChallengeModule): void {
    this.modules.set(module.id, module);
  }

  get(id: string): ChallengeModule | undefined {
    return this.modules.get(id);
  }

  getAll(): ChallengeModule[] {
    return Array.from(this.modules.values());
  }

  getAvailable(): ChallengeModule[] {
    return this.getAll().filter(m => m.available);
  }

  getByCategory(category: ChallengeCategory): ChallengeModule[] {
    return this.getAll().filter(m => m.category === category);
  }
}

export const challengeRegistry = new ChallengeRegistry();
