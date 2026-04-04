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
  if (score >= 95) return 'Perfect!';
  if (score >= 85) return 'Excellent!';
  if (score >= 70) return 'Well done!';
  if (score >= 50) return 'Not bad';
  if (score >= 30) return 'Keep practicing!';
  return 'Try again!';
}
