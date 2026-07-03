import { PRESSED_COLOR } from "../chartTheme";

interface PianoKeyboardProps {
  // Semitone to highlight, relative to the leftmost Do (0-35 over 3 octaves)
  highlightSemitone: number | null;
  className?: string;
  darkMode?: boolean;
}

const OCTAVES = 3;
const WHITE_W = 30;
const WHITE_H = 140;
const BLACK_W = 18;
const BLACK_H = 88;
const LABEL_H = 22;

const WIDTH = OCTAVES * 7 * WHITE_W;
const HEIGHT = WHITE_H + LABEL_H;

// Pitch classes of the white keys (Do Ré Mi Fa Sol La Si)
const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
// Black-key pitch class -> index of the white key it follows
const BLACK_AFTER_WHITE: Record<number, number> = {
  1: 0,
  3: 1,
  6: 3,
  8: 4,
  10: 5,
};

const OCTAVE_LABELS = ["Do grave", "Do", "Do aigu"];

export const PianoKeyboard = ({
  highlightSemitone,
  className = "",
  darkMode = false,
}: PianoKeyboardProps) => {
  const whiteFill = darkMode ? "#e5e5e5" : "#FFFFFF";
  const blackFill = darkMode ? "#0a0a0a" : "#1f2937";
  const border = darkMode ? "#6b7280" : "#374151";
  const textColor = darkMode ? "#e5e5e5" : "#4B5563";

  const highlightOctave =
    highlightSemitone === null ? null : Math.floor(highlightSemitone / 12);
  const highlightPc =
    highlightSemitone === null ? null : highlightSemitone % 12;

  const whiteKeys = [];
  const blackKeys = [];
  for (let octave = 0; octave < OCTAVES; octave++) {
    for (let w = 0; w < 7; w++) {
      const x = (octave * 7 + w) * WHITE_W;
      const isHighlighted =
        octave === highlightOctave &&
        highlightPc !== null &&
        WHITE_SEMITONES[w] === highlightPc;
      whiteKeys.push(
        <rect
          key={`w-${octave}-${w}`}
          x={x}
          y={0}
          width={WHITE_W}
          height={WHITE_H}
          fill={isHighlighted ? PRESSED_COLOR : whiteFill}
          stroke={border}
          strokeWidth="1"
        />,
      );
    }

    for (const [pc, afterWhite] of Object.entries(BLACK_AFTER_WHITE)) {
      const x = (octave * 7 + Number(afterWhite)) * WHITE_W + WHITE_W - BLACK_W / 2;
      const isHighlighted =
        octave === highlightOctave && Number(pc) === highlightPc;
      blackKeys.push(
        <rect
          key={`b-${octave}-${pc}`}
          x={x}
          y={0}
          width={BLACK_W}
          height={BLACK_H}
          rx={2}
          fill={isHighlighted ? PRESSED_COLOR : blackFill}
          stroke={border}
          strokeWidth="1"
        />,
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      style={{ width: "100%", maxWidth: WIDTH, height: "auto" }}
    >
      {whiteKeys}
      {/* Black keys drawn on top of the white keys */}
      {blackKeys}

      {/* Label the three Do's for orientation */}
      {OCTAVE_LABELS.map((label, octave) => (
        <text
          key={label}
          x={octave * 7 * WHITE_W + 3}
          y={WHITE_H + 15}
          fontSize={10}
          fill={textColor}
          fontFamily="system-ui"
        >
          {label}
        </text>
      ))}
    </svg>
  );
};
