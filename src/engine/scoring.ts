export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-pixel-emerald';
  if (score >= 50) return 'text-pixel-gold';
  return 'text-pixel-red';
}

export function getScoreLabel(score: number): string {
  if (score >= 95) return 'Perfekt!';
  if (score >= 85) return 'Ausgezeichnet!';
  if (score >= 70) return 'Gut gemacht!';
  if (score >= 50) return 'Nicht schlecht';
  if (score >= 30) return 'Weiter ueben!';
  return 'Versuch es nochmal!';
}
