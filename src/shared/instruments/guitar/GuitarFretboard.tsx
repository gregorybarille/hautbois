import { PRESSED_COLOR } from "../chartTheme";
import {
  getFretPositions,
  MAX_FRET,
  OPEN_STRING_LABELS,
} from "./positions";

interface GuitarFretboardProps {
  note: string;
  className?: string;
  darkMode?: boolean;
}

const NUT_X = 60;
const FRET_SPACING = 55;
const STRING_SPACING = 30;
const TOP_Y = 30;
const BOTTOM_Y = TOP_Y + 5 * STRING_SPACING;
const WIDTH = NUT_X + MAX_FRET * FRET_SPACING + 20;
const HEIGHT = BOTTOM_Y + 45;

// Frets with inlay dots (double dot at 12)
const INLAY_FRETS = [3, 5, 7, 9];

// y position of a string; string 0 (low Mi) is at the bottom
const stringY = (string: number) => BOTTOM_Y - string * STRING_SPACING;
// x position of a dot within a fret
const fretX = (fret: number) => NUT_X + (fret - 0.5) * FRET_SPACING;

export const GuitarFretboard = ({
  note,
  className = "",
  darkMode = false,
}: GuitarFretboardProps) => {
  const boardFill = darkMode ? "#2a1f1a" : "#8B5A2B";
  const fretColor = darkMode ? "#9ca3af" : "#d1d5db";
  const nutColor = darkMode ? "#e5e5e5" : "#F5F0E6";
  const stringColor = darkMode ? "#d1d5db" : "#e8e0d0";
  const inlayColor = darkMode ? "#6b7280" : "#D4C8B8";
  const textColor = darkMode ? "#e5e5e5" : "#4B5563";

  const positions = getFretPositions(note);
  const fretted = positions.filter((p) => p.fret > 0);
  const open = positions.filter((p) => p.fret === 0);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      style={{ width: "100%", maxWidth: WIDTH, height: "auto" }}
    >
      {/* Fretboard */}
      <rect
        x={NUT_X}
        y={TOP_Y - 12}
        width={MAX_FRET * FRET_SPACING}
        height={BOTTOM_Y - TOP_Y + 24}
        rx={4}
        fill={boardFill}
      />

      {/* Nut */}
      <rect
        x={NUT_X - 5}
        y={TOP_Y - 12}
        width={5}
        height={BOTTOM_Y - TOP_Y + 24}
        fill={nutColor}
      />

      {/* Inlay dots */}
      {INLAY_FRETS.map((fret) => (
        <circle
          key={fret}
          cx={fretX(fret)}
          cy={(TOP_Y + BOTTOM_Y) / 2}
          r={6}
          fill={inlayColor}
        />
      ))}
      <circle
        cx={fretX(12)}
        cy={(TOP_Y + BOTTOM_Y) / 2 - STRING_SPACING}
        r={6}
        fill={inlayColor}
      />
      <circle
        cx={fretX(12)}
        cy={(TOP_Y + BOTTOM_Y) / 2 + STRING_SPACING}
        r={6}
        fill={inlayColor}
      />

      {/* Frets */}
      {Array.from({ length: MAX_FRET }, (_, i) => i + 1).map((fret) => (
        <line
          key={fret}
          x1={NUT_X + fret * FRET_SPACING}
          y1={TOP_Y - 12}
          x2={NUT_X + fret * FRET_SPACING}
          y2={BOTTOM_Y + 12}
          stroke={fretColor}
          strokeWidth="2"
        />
      ))}

      {/* Strings (thicker = lower) */}
      {OPEN_STRING_LABELS.map((label, string) => (
        <g key={string}>
          <line
            x1={NUT_X - 5}
            y1={stringY(string)}
            x2={NUT_X + MAX_FRET * FRET_SPACING}
            y2={stringY(string)}
            stroke={stringColor}
            strokeWidth={2.5 - string * 0.3}
          />
          <text
            x={15}
            y={stringY(string) + 4}
            fontSize={12}
            fill={textColor}
            fontFamily="system-ui"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Open-string positions (circle left of the nut) */}
      {open.map(({ string }) => (
        <circle
          key={`open-${string}`}
          cx={NUT_X - 22}
          cy={stringY(string)}
          r={8}
          fill="none"
          stroke={PRESSED_COLOR}
          strokeWidth="3"
        />
      ))}

      {/* Fretted positions */}
      {fretted.map(({ string, fret }) => (
        <circle
          key={`${string}-${fret}`}
          cx={fretX(fret)}
          cy={stringY(string)}
          r={10}
          fill={PRESSED_COLOR}
          stroke={darkMode ? "#1a1a1a" : "#ffffff"}
          strokeWidth="2"
        />
      ))}

      {/* Fret numbers */}
      {[...INLAY_FRETS, 12].map((fret) => (
        <text
          key={fret}
          x={fretX(fret)}
          y={BOTTOM_Y + 34}
          fontSize={12}
          fill={textColor}
          fontFamily="system-ui"
          textAnchor="middle"
        >
          {fret}
        </text>
      ))}
    </svg>
  );
};
