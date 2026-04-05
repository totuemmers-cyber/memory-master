interface StoryDisplayProps {
  sentences: string[];
}

export function StoryDisplay({ sentences }: StoryDisplayProps) {
  return (
    <div className="challenge-zone max-w-2xl mx-auto p-6 sm:p-8 rounded-lg bg-pixel-surface">
      <div className="text-white text-base sm:text-lg leading-relaxed tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.8' }}>
        {sentences.map((sentence, i) => (
          <span key={i}>
            {sentence}
            {i < sentences.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
