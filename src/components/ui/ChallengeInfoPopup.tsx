import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ChallengeCategory } from '../../types';

interface ChallengeInfo {
  category: ChallengeCategory;
  nameDE: string;
  icon: string;
  what: string;
  trains: string;
  benefit: string;
}

const CHALLENGE_INFO: Record<string, ChallengeInfo> = {
  'observation-chamber': {
    category: 'observation',
    nameDE: 'Observation Chamber',
    icon: '👁',
    what: 'Memorize objects with different shapes, colors, and sizes. Then answer questions about what you saw.',
    trains: 'Visual perception, detail memory, attention to colors, shapes, and positions.',
    benefit: 'Strengthens your ability to quickly absorb surroundings and retain details — useful for studying, reading, and everyday life.',
  },
  'link-chain': {
    category: 'association',
    nameDE: 'Link Chain',
    icon: '🔗',
    what: 'Link words into an association chain and recall them in the correct order.',
    trains: 'Associative thinking, semantic memory, creativity.',
    benefit: 'Improves your ability to remember lists, names, and vocabulary through creative associations.',
  },
  'number-shape': {
    category: 'numerical',
    nameDE: 'Number Shape',
    icon: '🔢',
    what: 'Memorize number sequences and recall them from memory.',
    trains: 'Numerical working memory, concentration, pattern recognition.',
    benefit: 'Helps in everyday life with PINs, phone numbers, and anywhere numbers matter.',
  },
  'palace-builder': {
    category: 'spatial',
    nameDE: 'Palace Builder',
    icon: '🏰',
    what: 'Use the method of loci — place information at locations in a mental memory palace.',
    trains: 'Spatial memory, mental navigation, method of loci.',
    benefit: 'The loci technique is one of the oldest and most effective memory methods — ideal for presentations and exams.',
  },
  'face-vault': {
    category: 'social',
    nameDE: 'Face Vault',
    icon: '👤',
    what: 'Memorize faces along with names and details.',
    trains: 'Face recognition, name-face association, social memory.',
    benefit: 'Makes meeting new people easier — remembering names builds trust and strengthens relationships.',
  },
  'card-recall': {
    category: 'sequential',
    nameDE: 'Card Recall',
    icon: '🃏',
    what: 'Memorize the order of revealed cards and recall them.',
    trains: 'Sequential memory, order encoding, focus.',
    benefit: 'Trains working memory for ordered information — important for learning procedures and routines.',
  },
  'story-recall': {
    category: 'narrative',
    nameDE: 'Story Recall',
    icon: '📖',
    what: 'Read a short story and answer questions about content and details.',
    trains: 'Reading comprehension, narrative memory, information extraction.',
    benefit: 'Strengthens your ability to retain key information from texts and conversations.',
  },
  'date-keeper': {
    category: 'numerical',
    nameDE: 'Date Keeper',
    icon: '📅',
    what: 'Memorize dates and their associated events.',
    trains: 'Temporal memory, date-event association.',
    benefit: 'Improves your recall of appointments, birthdays, and historical dates.',
  },
};

export function ChallengeInfoButton({ challengeId }: { challengeId: string }) {
  const [open, setOpen] = useState(false);
  const info = CHALLENGE_INFO[challengeId];

  if (!info) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="w-6 h-6 flex items-center justify-center text-pixel-muted hover:text-pixel-gold text-pixel-xs transition-colors"
        title="Info"
      >
        ?
      </button>
      {open && createPortal(
        <ChallengeInfoModal info={info} onClose={() => setOpen(false)} />,
        document.body
      )}
    </>
  );
}

function ChallengeInfoModal({ info, onClose }: { info: ChallengeInfo; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative bg-pixel-dark pixel-border max-w-sm w-full p-6 overflow-y-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <span className="text-3xl">{info.icon}</span>
          <h2 className="text-pixel-gold text-pixel-lg mt-2">{info.nameDE}</h2>
        </div>

        <div className="space-y-4 challenge-zone text-sm leading-relaxed">
          <div>
            <div className="font-pixel text-pixel-xs text-pixel-blue mb-1">What?</div>
            <p className="text-gray-300">{info.what}</p>
          </div>
          <div>
            <div className="font-pixel text-pixel-xs text-pixel-emerald mb-1">Trains</div>
            <p className="text-gray-300">{info.trains}</p>
          </div>
          <div>
            <div className="font-pixel text-pixel-xs text-pixel-purple mb-1">Why?</div>
            <p className="text-gray-300">{info.benefit}</p>
          </div>
        </div>

        <div className="text-center mt-5">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-pixel-surface text-white font-pixel text-pixel-xs pixel-border-muted hover:brightness-110"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
