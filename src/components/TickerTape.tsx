interface TickerTapeProps {
  items: string[];
  speed?: number;
}

export default function TickerTape({ items, speed = 30 }: TickerTapeProps) {
  const text = items.join('  ·  ') + '  ·  ';
  const doubled = text + text;

  return (
    <div className="overflow-hidden bg-[#0a1a10] border-b border-[#D4A017]/30 py-2">
      <div
        className="whitespace-nowrap inline-block"
        style={{ animation: `ticker ${speed}s linear infinite` }}
      >
        <span className="text-[#D4A017] font-code text-xs tracking-widest uppercase mr-8">
          {doubled}
        </span>
      </div>
    </div>
  );
}
