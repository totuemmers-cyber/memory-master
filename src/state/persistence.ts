import type { GameState } from '../types';

let idCounter = 0;
export function v4Id(): string {
  idCounter++;
  return `${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

export function exportGameState(state: GameState): string {
  return JSON.stringify(state, null, 2);
}

export function downloadAsFile(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importGameState(json: string): { success: boolean; state?: GameState; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.version || !parsed.profile || !Array.isArray(parsed.history)) {
      return { success: false, error: 'Invalid save file format' };
    }
    return { success: true, state: parsed as GameState };
  } catch {
    return { success: false, error: 'Invalid JSON' };
  }
}
