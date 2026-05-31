interface CoatOfArmsProps {
  size?: number;
  className?: string;
}

export default function CoatOfArms({ size = 80, className = '' }: CoatOfArmsProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield base */}
      <path
        d="M50 8 L82 22 L82 54 C82 72 66 88 50 94 C34 88 18 72 18 54 L18 22 Z"
        fill="none"
        stroke="#D4A017"
        strokeWidth="1.5"
      />
      {/* Shield inner */}
      <path
        d="M50 14 L76 26 L76 54 C76 69 63 83 50 88 C37 83 24 69 24 54 L24 26 Z"
        fill="rgba(27,67,50,0.3)"
        stroke="#D4A017"
        strokeWidth="0.8"
      />
      {/* Horizontal band */}
      <rect x="24" y="46" width="52" height="14" fill="rgba(212,160,23,0.15)" stroke="#D4A017" strokeWidth="0.6" />
      {/* Spear left */}
      <line x1="38" y1="10" x2="38" y2="90" stroke="#D4A017" strokeWidth="1.2" />
      <polygon points="38,6 35,14 41,14" fill="#D4A017" />
      {/* Spear right */}
      <line x1="62" y1="10" x2="62" y2="90" stroke="#D4A017" strokeWidth="1.2" />
      <polygon points="62,6 59,14 65,14" fill="#D4A017" />
      {/* Central rooster shape (simplified) */}
      <circle cx="50" cy="36" r="6" fill="none" stroke="#D4A017" strokeWidth="1" />
      <line x1="50" y1="30" x2="50" y2="24" stroke="#D4A017" strokeWidth="1" />
      <line x1="46" y1="36" x2="54" y2="36" stroke="#D4A017" strokeWidth="1" />
      {/* Stars */}
      <polygon points="50,17 51.5,21.5 56,21.5 52.5,24 54,28.5 50,26 46,28.5 47.5,24 44,21.5 48.5,21.5" fill="#D4A017" opacity="0.6" transform="scale(0.5) translate(50,20)" />
      {/* Bottom geometric */}
      <path d="M32 64 Q50 74 68 64" stroke="#D4A017" strokeWidth="0.8" fill="none" />
      {/* Maasai shield horizontal stripes */}
      <line x1="30" y1="50" x2="70" y2="50" stroke="#D4A017" strokeWidth="0.5" opacity="0.4" />
      <line x1="30" y1="54" x2="70" y2="54" stroke="#D4A017" strokeWidth="0.5" opacity="0.4" />
      <line x1="30" y1="58" x2="70" y2="58" stroke="#D4A017" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}
