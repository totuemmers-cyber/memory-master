export function generateSequence(digitCount: number): string[] {
  const digits: string[] = [];
  for (let i = 0; i < digitCount; i++) {
    digits.push(String(Math.floor(Math.random() * 10)));
  }
  return digits;
}

export function scoreSequence(playerDigits: string[], correctDigits: string[]): { correct: number; total: number; perPosition: boolean[] } {
  const perPosition = correctDigits.map((d, i) => playerDigits[i] === d);
  return {
    correct: perPosition.filter(Boolean).length,
    total: correctDigits.length,
    perPosition,
  };
}
