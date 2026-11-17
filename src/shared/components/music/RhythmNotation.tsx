import { BEATS_PER_BAR, RhythmPattern } from "@/shared/music/rhythm";

type OnsetStatus = "hit" | "miss" | null;

interface RhythmNotationProps {
  pattern: RhythmPattern;
  activeBeat: number | null;
  onsetStatus: (onset: number) => OnsetStatus;
  darkMode?: boolean;
}

const BEAT_WIDTH = 96;
const MARGIN = 24;
const PAD = 16; // inset from the beat cell edge for onset positions
const STAFF_Y = 78;
const STEM_LEN = 42;
const BEAM_Y = STAFF_Y - STEM_LEN;
const NOTE_RX = 6.5;
const NOTE_RY = 5;
const HEIGHT = 130;

// x position for an onset fraction (0..1) within a beat cell.
const fracX = (beatX0: number, frac: number) =>
  beatX0 + PAD + frac * (BEAT_WIDTH - 2 * PAD);

export const RhythmNotation = ({
  pattern,
  activeBeat,
  onsetStatus,
  darkMode = false,
}: RhythmNotationProps) => {
  const staffColor = darkMode ? "#64748b" : "#334155";
  const noteColor = darkMode ? "#e2e8f0" : "#1e293b";
  const hitColor = "#22c55e";
  const missColor = "#ef4444";

  const width = MARGIN * 2 + BEATS_PER_BAR * BEAT_WIDTH;

  const colorFor = (onset: number) => {
    const status = onsetStatus(onset);
    return status === "hit" ? hitColor : status === "miss" ? missColor : noteColor;
  };

  const Notehead = ({ x, color }: { x: number; color: string }) => (
    <ellipse
      cx={x}
      cy={STAFF_Y}
      rx={NOTE_RX}
      ry={NOTE_RY}
      fill={color}
      transform={`rotate(-20 ${x} ${STAFF_Y})`}
    />
  );

  const Stem = ({
    x,
    color,
    to = BEAM_Y,
  }: {
    x: number;
    color: string;
    to?: number;
  }) => (
    <line
      x1={x + 6}
      y1={STAFF_Y - 1}
      x2={x + 6}
      y2={to}
      stroke={color}
      strokeWidth={1.5}
    />
  );

  const Flag = ({ x, color }: { x: number; color: string }) => (
    <path
      d={`M ${x + 6} ${BEAM_Y} C ${x + 20} ${BEAM_Y + 3}, ${x + 19} ${BEAM_Y + 15}, ${x + 8} ${BEAM_Y + 21}`}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );

  // Custom vector glyphs, not font text: the SMuFL/Unicode rest characters
  // (U+1D13D/U+1D13E) are outside the font coverage that renders the clef,
  // so they show as tofu boxes in some environments.
  const QuarterRest = ({ x, color }: { x: number; color: string }) => (
    <path
      d={`M ${x - 4} ${STAFF_Y - 14}
          C ${x + 7} ${STAFF_Y - 11}, ${x - 6} ${STAFF_Y - 3}, ${x + 5} ${STAFF_Y}
          C ${x - 6} ${STAFF_Y + 3}, ${x + 7} ${STAFF_Y + 9}, ${x - 3} ${STAFF_Y + 16}`}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  const EighthRest = ({ x, color }: { x: number; color: string }) => (
    <g>
      <circle cx={x + 3} cy={STAFF_Y - 8} r={3} fill={color} />
      <path
        d={`M ${x + 3} ${STAFF_Y - 8} C ${x + 9} ${STAFF_Y - 4}, ${x + 6} ${STAFF_Y + 4}, ${x - 3} ${STAFF_Y + 6}`}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </g>
  );

  const renderBeat = (beatIdx: number) => {
    const cellId = pattern.cellIds[beatIdx];
    const beatX0 = MARGIN + beatIdx * BEAT_WIDTH;
    const center = beatX0 + BEAT_WIDTH / 2;
    const onsetAt = (frac: number) => beatIdx + frac;

    switch (cellId) {
      case "rest":
        return <QuarterRest key={beatIdx} x={center} color={noteColor} />;

      case "quarter": {
        const color = colorFor(onsetAt(0));
        return (
          <g key={beatIdx}>
            <Stem x={center - 6} color={color} />
            <Notehead x={center} color={color} />
          </g>
        );
      }

      case "eighths": {
        const x1 = fracX(beatX0, 0);
        const x2 = fracX(beatX0, 0.5);
        const c1 = colorFor(onsetAt(0));
        const c2 = colorFor(onsetAt(0.5));
        return (
          <g key={beatIdx}>
            <line
              x1={x1 + 6}
              y1={BEAM_Y}
              x2={x2 + 6}
              y2={BEAM_Y}
              stroke={staffColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Stem x={x1} color={c1} />
            <Stem x={x2} color={c2} />
            <Notehead x={x1} color={c1} />
            <Notehead x={x2} color={c2} />
          </g>
        );
      }

      case "sixteenths": {
        const xs = [0, 0.25, 0.5, 0.75].map((f) => fracX(beatX0, f));
        const colors = [0, 0.25, 0.5, 0.75].map((f) => colorFor(onsetAt(f)));
        return (
          <g key={beatIdx}>
            <line
              x1={xs[0] + 6}
              y1={BEAM_Y}
              x2={xs[3] + 6}
              y2={BEAM_Y}
              stroke={staffColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <line
              x1={xs[0] + 6}
              y1={BEAM_Y + 6}
              x2={xs[3] + 6}
              y2={BEAM_Y + 6}
              stroke={staffColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {xs.map((x, i) => (
              <g key={i}>
                <Stem x={x} color={colors[i]} />
                <Notehead x={x} color={colors[i]} />
              </g>
            ))}
          </g>
        );
      }

      case "dotted": {
        const x1 = fracX(beatX0, 0);
        const x2 = fracX(beatX0, 0.75);
        const c1 = colorFor(onsetAt(0));
        const c2 = colorFor(onsetAt(0.75));
        return (
          <g key={beatIdx}>
            <line
              x1={x1 + 6}
              y1={BEAM_Y}
              x2={x2 + 6}
              y2={BEAM_Y}
              stroke={staffColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Secondary (16th) beam segment, only on the second note's side */}
            <line
              x1={x2 - 18}
              y1={BEAM_Y + 6}
              x2={x2 + 6}
              y2={BEAM_Y + 6}
              stroke={staffColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Stem x={x1} color={c1} />
            <Stem x={x2} color={c2} />
            <Notehead x={x1} color={c1} />
            <circle cx={x1 + 11} cy={STAFF_Y} r={2} fill={c1} />
            <Notehead x={x2} color={c2} />
          </g>
        );
      }

      case "offbeat": {
        const restX = fracX(beatX0, 0.25);
        const x = fracX(beatX0, 0.5);
        const color = colorFor(onsetAt(0.5));
        return (
          <g key={beatIdx}>
            <EighthRest x={restX} color={noteColor} />
            <Stem x={x} color={color} to={BEAM_Y} />
            <Flag x={x} color={color} />
            <Notehead x={x} color={color} />
          </g>
        );
      }

      default:
        return null;
    }
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {Array.from({ length: BEATS_PER_BAR }, (_, i) => i).map(
        (i) =>
          activeBeat === i && (
            <rect
              key={`hl-${i}`}
              x={MARGIN + i * BEAT_WIDTH}
              y={8}
              width={BEAT_WIDTH}
              height={HEIGHT - 16}
              rx={8}
              fill="#3b82f6"
              opacity={0.12}
            />
          ),
      )}

      {/* Barlines */}
      <line
        x1={MARGIN}
        y1={STAFF_Y - 4}
        x2={MARGIN}
        y2={STAFF_Y + 4}
        stroke={staffColor}
      />
      <line
        x1={width - MARGIN}
        y1={STAFF_Y - 4}
        x2={width - MARGIN}
        y2={STAFF_Y + 4}
        stroke={staffColor}
      />
      {/* Single rhythm-staff line */}
      <line
        x1={MARGIN}
        y1={STAFF_Y}
        x2={width - MARGIN}
        y2={STAFF_Y}
        stroke={staffColor}
      />

      {Array.from({ length: BEATS_PER_BAR }, (_, i) => renderBeat(i))}
    </svg>
  );
};
