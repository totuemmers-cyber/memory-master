import { useState } from 'react';
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
    nameDE: 'Beobachtungskammer',
    icon: '👁',
    what: 'Praege dir Objekte mit verschiedenen Formen, Farben und Groessen ein. Danach beantwortest du Fragen zu dem, was du gesehen hast.',
    trains: 'Visuelle Wahrnehmung, Detailgedaechtnis, Aufmerksamkeit fuer Farben, Formen und Positionen.',
    benefit: 'Staerkt die Faehigkeit, Umgebungen schnell zu erfassen und Details zu behalten — nuetzlich beim Lernen, Lesen und im Alltag.',
  },
  'link-chain': {
    category: 'association',
    nameDE: 'Kettenglieder',
    icon: '🔗',
    what: 'Verknuepfe Woerter zu einer Assoziationskette und rufe sie in der richtigen Reihenfolge ab.',
    trains: 'Assoziatives Denken, semantisches Gedaechtnis, Kreativitaet.',
    benefit: 'Verbessert die Merkfaehigkeit fuer Listen, Namen und Vokabeln durch kreative Verknuepfungen.',
  },
  'number-shape': {
    category: 'numerical',
    nameDE: 'Zahlenformen',
    icon: '🔢',
    what: 'Merke dir Zahlenfolgen und gib sie aus dem Gedaechtnis wieder.',
    trains: 'Numerisches Arbeitsgedaechtnis, Konzentration, Mustererkennung.',
    benefit: 'Hilft im Alltag bei PINs, Telefonnummern und ueberall dort, wo Zahlen eine Rolle spielen.',
  },
  'palace-builder': {
    category: 'spatial',
    nameDE: 'Palastbauer',
    icon: '🏰',
    what: 'Nutze die Loci-Methode — platziere Informationen an Orten in einem mentalen Gedaechtnispalast.',
    trains: 'Raeumliches Gedaechtnis, mentale Navigation, Loci-Methode.',
    benefit: 'Die Loci-Technik ist eine der aeltesten und effektivsten Merkmethoden — ideal fuer Praesentationen und Pruefungen.',
  },
  'face-vault': {
    category: 'social',
    nameDE: 'Gesichtertresor',
    icon: '👤',
    what: 'Merke dir Gesichter zusammen mit Namen und Details.',
    trains: 'Gesichtserkennung, Name-Gesicht-Assoziation, soziales Gedaechtnis.',
    benefit: 'Erleichtert den Umgang mit neuen Menschen — sich Namen zu merken schafft Vertrauen und staerkt Beziehungen.',
  },
  'card-recall': {
    category: 'sequential',
    nameDE: 'Kartengedaechtnis',
    icon: '🃏',
    what: 'Merke dir die Reihenfolge aufgedeckter Karten und gib sie wieder.',
    trains: 'Sequentielles Gedaechtnis, Reihenfolge-Encoding, Fokus.',
    benefit: 'Trainiert das Arbeitsgedaechtnis fuer geordnete Informationen — wichtig beim Erlernen von Ablaeufen und Routinen.',
  },
  'story-recall': {
    category: 'narrative',
    nameDE: 'Geschichtenfaenger',
    icon: '📖',
    what: 'Lies eine kurze Geschichte und beantworte Fragen zu Inhalt und Details.',
    trains: 'Textverstaendnis, narratives Gedaechtnis, Informationsextraktion.',
    benefit: 'Staerkt die Faehigkeit, aus Texten und Gespraechen die wichtigsten Informationen zu behalten.',
  },
  'date-keeper': {
    category: 'numerical',
    nameDE: 'Datumswaechter',
    icon: '📅',
    what: 'Merke dir Daten und die dazugehoerigen Ereignisse.',
    trains: 'Zeitliches Gedaechtnis, Datum-Ereignis-Assoziation.',
    benefit: 'Verbessert die Erinnerung an Termine, Geburtstage und historische Daten.',
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
      {open && <ChallengeInfoModal info={info} onClose={() => setOpen(false)} />}
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
            <div className="font-pixel text-pixel-xs text-pixel-blue mb-1">Was?</div>
            <p className="text-gray-300">{info.what}</p>
          </div>
          <div>
            <div className="font-pixel text-pixel-xs text-pixel-emerald mb-1">Trainiert</div>
            <p className="text-gray-300">{info.trains}</p>
          </div>
          <div>
            <div className="font-pixel text-pixel-xs text-pixel-purple mb-1">Warum?</div>
            <p className="text-gray-300">{info.benefit}</p>
          </div>
        </div>

        <div className="text-center mt-5">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-pixel-surface text-white font-pixel text-pixel-xs pixel-border-muted hover:brightness-110"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
