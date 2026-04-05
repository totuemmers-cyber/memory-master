import type { FaceData, SkinTone, HairColor } from './types';

const SKIN_COLORS: Record<SkinTone, string> = {
  light: '#FDDCB5',
  fair: '#F5C5A3',
  medium: '#D4A574',
  olive: '#C49A6C',
  brown: '#8B6B4A',
  dark: '#5C3D2E',
};

const HAIR_COLORS: Record<HairColor, string> = {
  black: '#1a1a1a',
  brown: '#6B3A2A',
  blonde: '#E8C84A',
  red: '#C0392B',
  gray: '#808080',
  blue: '#3498DB',
};

interface PixelFaceProps {
  face: FaceData;
  size?: number;
  showName?: boolean;
}

export function PixelFace({ face, size = 80, showName = false }: PixelFaceProps) {
  const skin = SKIN_COLORS[face.skinTone];
  const hair = HAIR_COLORS[face.hairColor];

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Background circle for framing */}
        <rect x="0" y="0" width="80" height="80" rx="8" fill="#1a1a2e" />

        {/* Hair behind head (long, bob, ponytail need back layer) */}
        <HairBack style={face.hairStyle} color={hair} />

        {/* Head shape */}
        <Head shape={face.headShape} color={skin} />

        {/* Eyes */}
        <Eyes style={face.eyeStyle} />

        {/* Mouth */}
        <Mouth />

        {/* Hair on top */}
        <HairFront style={face.hairStyle} color={hair} />

        {/* Accessories */}
        <AccessoryLayer type={face.accessory} />
      </svg>
      {showName && (
        <div className="font-pixel text-pixel-xs text-pixel-gold text-center truncate max-w-[100px]">
          {face.name}
        </div>
      )}
    </div>
  );
}

function Head({ shape, color }: { shape: string; color: string }) {
  switch (shape) {
    case 'round':
      return <ellipse cx="40" cy="42" rx="22" ry="24" fill={color} />;
    case 'oval':
      return <ellipse cx="40" cy="42" rx="19" ry="26" fill={color} />;
    case 'square':
      return <rect x="18" y="18" width="44" height="48" rx="6" fill={color} />;
    default:
      return <ellipse cx="40" cy="42" rx="22" ry="24" fill={color} />;
  }
}

function Eyes({ style }: { style: string }) {
  const y = 38;
  const color = '#1a1a1a';

  switch (style) {
    case 'round':
      return (
        <>
          <circle cx="32" cy={y} r="3.5" fill={color} />
          <circle cx="48" cy={y} r="3.5" fill={color} />
          {/* Tiny highlight */}
          <circle cx="33" cy={y - 1} r="1" fill="#fff" opacity="0.6" />
          <circle cx="49" cy={y - 1} r="1" fill="#fff" opacity="0.6" />
        </>
      );
    case 'narrow':
      return (
        <>
          <ellipse cx="32" cy={y} rx="4" ry="2" fill={color} />
          <ellipse cx="48" cy={y} rx="4" ry="2" fill={color} />
        </>
      );
    case 'wide':
      return (
        <>
          <circle cx="32" cy={y} r="4.5" fill={color} />
          <circle cx="48" cy={y} r="4.5" fill={color} />
          <circle cx="33" cy={y - 1.5} r="1.5" fill="#fff" opacity="0.5" />
          <circle cx="49" cy={y - 1.5} r="1.5" fill="#fff" opacity="0.5" />
        </>
      );
    case 'almond':
      return (
        <>
          <ellipse cx="32" cy={y} rx="4.5" ry="3" fill={color} transform="rotate(-5 32 38)" />
          <ellipse cx="48" cy={y} rx="4.5" ry="3" fill={color} transform="rotate(5 48 38)" />
          <circle cx="33" cy={y - 0.5} r="1" fill="#fff" opacity="0.5" />
          <circle cx="49" cy={y - 0.5} r="1" fill="#fff" opacity="0.5" />
        </>
      );
    default:
      return (
        <>
          <circle cx="32" cy={y} r="3.5" fill={color} />
          <circle cx="48" cy={y} r="3.5" fill={color} />
        </>
      );
  }
}

function Mouth() {
  return (
    <path
      d="M 35 53 Q 40 57 45 53"
      fill="none"
      stroke="#1a1a1a"
      strokeWidth="2"
      strokeLinecap="round"
    />
  );
}

function HairBack({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'long':
      return (
        <>
          <rect x="14" y="26" width="10" height="38" rx="4" fill={color} />
          <rect x="56" y="26" width="10" height="38" rx="4" fill={color} />
        </>
      );
    case 'bob':
      return (
        <>
          <rect x="15" y="26" width="11" height="28" rx="4" fill={color} />
          <rect x="54" y="26" width="11" height="28" rx="4" fill={color} />
        </>
      );
    case 'ponytail':
      return (
        <circle cx="66" cy="30" r="7" fill={color} />
      );
    default:
      return null;
  }
}

function HairFront({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'short':
      return (
        <rect x="22" y="16" width="36" height="10" rx="4" fill={color} />
      );
    case 'long':
      return (
        <rect x="18" y="14" width="44" height="14" rx="6" fill={color} />
      );
    case 'curly':
      return (
        <>
          <circle cx="24" cy="20" r="7" fill={color} />
          <circle cx="36" cy="17" r="7" fill={color} />
          <circle cx="48" cy="18" r="7" fill={color} />
          <circle cx="57" cy="23" r="6" fill={color} />
          <circle cx="20" cy="27" r="5" fill={color} />
        </>
      );
    case 'bald':
      return null;
    case 'ponytail':
      return (
        <>
          <rect x="22" y="16" width="36" height="10" rx="4" fill={color} />
          {/* Ponytail connector */}
          <rect x="54" y="22" width="12" height="6" rx="2" fill={color} />
        </>
      );
    case 'spiky':
      return (
        <>
          <polygon points="25,22 28,8 31,22" fill={color} />
          <polygon points="33,20 37,5 41,20" fill={color} />
          <polygon points="42,20 46,7 50,20" fill={color} />
          <polygon points="50,22 53,10 56,22" fill={color} />
          {/* Base band */}
          <rect x="22" y="18" width="36" height="6" rx="2" fill={color} />
        </>
      );
    case 'bob':
      return (
        <rect x="18" y="14" width="44" height="14" rx="6" fill={color} />
      );
    case 'mohawk':
      return (
        <>
          <rect x="35" y="4" width="10" height="22" rx="3" fill={color} />
        </>
      );
    default:
      return null;
  }
}

function AccessoryLayer({ type }: { type: string }) {
  switch (type) {
    case 'glasses':
      return (
        <>
          {/* Left lens */}
          <circle cx="32" cy="38" r="7" fill="none" stroke="#555" strokeWidth="2" />
          {/* Right lens */}
          <circle cx="48" cy="38" r="7" fill="none" stroke="#555" strokeWidth="2" />
          {/* Bridge */}
          <line x1="39" y1="38" x2="41" y2="38" stroke="#555" strokeWidth="2" />
          {/* Arms */}
          <line x1="25" y1="36" x2="18" y2="34" stroke="#555" strokeWidth="1.5" />
          <line x1="55" y1="36" x2="62" y2="34" stroke="#555" strokeWidth="1.5" />
        </>
      );
    case 'hat':
      return (
        <>
          {/* Brim */}
          <rect x="12" y="16" width="56" height="5" rx="2" fill="#4A4A6A" />
          {/* Crown */}
          <rect x="20" y="4" width="40" height="14" rx="4" fill="#4A4A6A" />
          {/* Band */}
          <rect x="20" y="14" width="40" height="3" fill="#6A5A3A" />
        </>
      );
    case 'earring':
      return (
        <>
          <circle cx="16" cy="46" r="3" fill="#E8C84A" />
          <circle cx="16" cy="46" r="1.5" fill="#FFD700" />
        </>
      );
    default:
      return null;
  }
}
