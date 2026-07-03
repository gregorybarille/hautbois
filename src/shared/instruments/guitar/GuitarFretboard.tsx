import { PRESSED_COLOR } from "../chartTheme";
import type { ChordFingering } from "./chords";

interface Props {
  chord: ChordFingering;
  darkMode?: boolean;
  className?: string;
}

const STRINGS = 6;
const S = 28; // spacing between strings
const F = 38; // spacing between fret slots
const FRETS_SHOWN = 5;
const LEFT = 22;
const TOP = 58; // room for string labels + muted/open markers
const RIGHT = 28;
const BOT = 16;

const W = LEFT + (STRINGS - 1) * S + RIGHT;
const H = TOP + FRETS_SHOWN * F + BOT;

const sx = (s: number) => LEFT + s * S;
const fy = (offset: number) => TOP + offset * F;
const dotY = (fret: number, base: number) => TOP + (fret - base) * F + F / 2;

const STRING_LABELS = ["Mi", "La", "Ré", "Sol", "Si", "Mi"]; // low → high

// Exported as GuitarChordDiagram so the name reflects the new design
export const GuitarChordDiagram = ({ chord, darkMode = false, className = "" }: Props) => {
  const textColor = darkMode ? "#e5e5e5" : "#4B5563";
  const lineColor = darkMode ? "#9ca3af" : "#374151";
  const nutColor = darkMode ? "#e5e5e5" : "#1f2937";

  const pressedFrets = chord.strings.filter((f) => f > 0);
  const hasOpen = chord.strings.some((f) => f === 0);
  // Show nut when any open string is present or when pressed frets start at 1
  const baseFret =
    hasOpen || pressedFrets.length === 0
      ? 1
      : Math.min(...pressedFrets);
  const showNut = baseFret === 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} style={{ width: "100%", maxWidth: W, height: "auto" }}>
      {/* String names */}
      {STRING_LABELS.map((label, s) => (
        <text key={s} x={sx(s)} y={16} textAnchor="middle" fontSize={10} fill={textColor} fontFamily="system-ui">
          {label}
        </text>
      ))}

      {/* Muted (✕) or open (○) markers above the nut */}
      {chord.strings.map((fret, s) => {
        if (fret === 0) {
          return <circle key={s} cx={sx(s)} cy={36} r={6} fill="none" stroke={PRESSED_COLOR} strokeWidth={1.5} />;
        }
        if (fret < 0) {
          const cx = sx(s);
          return (
            <g key={s}>
              <line x1={cx - 5} y1={31} x2={cx + 5} y2={41} stroke={textColor} strokeWidth={1.5} />
              <line x1={cx + 5} y1={31} x2={cx - 5} y2={41} stroke={textColor} strokeWidth={1.5} />
            </g>
          );
        }
        return null;
      })}

      {/* Nut or fret-position label */}
      {showNut ? (
        <rect x={sx(0)} y={TOP - 6} width={(STRINGS - 1) * S} height={8} rx={2} fill={nutColor} />
      ) : (
        <text
          x={W - 2}
          y={fy(0) + F / 2 + 4}
          textAnchor="end"
          fontSize={12}
          fontWeight="bold"
          fill={textColor}
          fontFamily="system-ui"
        >
          {baseFret}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, i) => (
        <line key={i} x1={sx(0)} y1={fy(i)} x2={sx(STRINGS - 1)} y2={fy(i)} stroke={lineColor} strokeWidth={1} />
      ))}

      {/* String lines (thicker for lower strings) */}
      {Array.from({ length: STRINGS }, (_, s) => (
        <line key={s} x1={sx(s)} y1={fy(0)} x2={sx(s)} y2={fy(FRETS_SHOWN)} stroke={lineColor} strokeWidth={1.3 - s * 0.15} />
      ))}

      {/* Barre bar */}
      {chord.barre && (
        <rect
          x={sx(chord.barre.fromString) - 11}
          y={dotY(chord.barre.fret, baseFret) - 11}
          width={sx(chord.barre.toString) - sx(chord.barre.fromString) + 22}
          height={22}
          rx={11}
          fill={PRESSED_COLOR}
        />
      )}

      {/* Individual finger dots (skipped when covered by barre) */}
      {chord.strings.map((fret, s) => {
        if (fret <= 0) return null;
        if (
          chord.barre &&
          fret === chord.barre.fret &&
          s >= chord.barre.fromString &&
          s <= chord.barre.toString
        )
          return null;
        return <circle key={s} cx={sx(s)} cy={dotY(fret, baseFret)} r={11} fill={PRESSED_COLOR} />;
      })}
    </svg>
  );
};
