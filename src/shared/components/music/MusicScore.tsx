import { useEffect, useRef } from "react";
import { noteStep, parseNote } from "../../music/notes";

interface MusicScoreProps {
  notes: string[];
  activeNote?: string;
  onNoteClick?: (note: string) => void;
  darkMode?: boolean;
  // Per-note color override (e.g. quiz status); wins over activeNote color.
  noteColor?: (note: string, index: number) => string | undefined;
  noteSpacing?: number;
}

export const MusicScore = ({
  notes,
  activeNote,
  onNoteClick,
  darkMode = false,
  noteColor,
  noteSpacing = 50,
}: MusicScoreProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active note
  useEffect(() => {
    if (activeNote && containerRef.current) {
      const index = notes.indexOf(activeNote);
      if (index !== -1) {
        const element = document.getElementById(`note-${index}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [activeNote, notes]);

  const STAFF_Y_START = 50; // Moved down slightly to fit high notes
  const LINE_SPACING = 10; // Space between lines
  const STEP_HEIGHT = LINE_SPACING / 2; // 5px per note step
  const START_OFFSET = 60; // Space for Clef

  const width = START_OFFSET + notes.length * noteSpacing + 40;
  const height = 160;

  // Colors based on mode
  const staffColor = darkMode ? "#6b7280" : "#374151";
  const baseNoteColor = darkMode ? "#e5e5e5" : "#1f2937";
  const activeColor = "#8B5CF6"; // violet
  const bgColor = darkMode ? "#1a1a1a" : "#f9fafb";
  const borderColor = darkMode ? "#374151" : "#e5e7eb";

  // Helper to draw staff lines
  const renderStaffLines = () => {
    const lines = [];
    for (let i = 0; i < 5; i++) {
      const y = STAFF_Y_START + i * LINE_SPACING;
      lines.push(
        <line
          key={i}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={staffColor}
          strokeWidth="1"
        />,
      );
    }
    return lines;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "0.75rem",
        border: "1px solid",
        padding: "1rem",
        scrollBehavior: "smooth",
        backgroundColor: bgColor,
        borderColor: borderColor,
        transition: "all 0.3s ease",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ display: "block", margin: "0 auto" }}
      >
        {renderStaffLines()}

        {/* Treble Clef */}
        <text
          x={10}
          y={STAFF_Y_START + 4 * LINE_SPACING - 5}
          fontFamily="serif"
          fontSize="65"
          fill={baseNoteColor}
        >
          𝄞
        </text>

        {notes.map((noteName, index) => {
          const step = noteStep(noteName);
          if (step === null) return null;
          const accidental = parseNote(noteName)?.accidental ?? 0;

          const x = START_OFFSET + index * noteSpacing;
          // Calculate Y based on step relative to top line (F5)
          const cy = STAFF_Y_START + step * STEP_HEIGHT;

          const isActive = noteName === activeNote;
          const currentNoteColor =
            noteColor?.(noteName, index) ??
            (isActive ? activeColor : baseNoteColor);

          // Ledger lines
          const renderLedgerLines = () => {
            const lines = [];
            // Top ledger lines (if step <= -2) (A5 and above)
            for (let s = -2; s >= step; s -= 2) {
              const ly = STAFF_Y_START + s * STEP_HEIGHT;
              lines.push(
                <line
                  key={`top-${s}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke={staffColor}
                  strokeWidth="1"
                />,
              );
            }

            // Bottom ledger lines (if step >= 10) (C4 and below)
            for (let s = 10; s <= step; s += 2) {
              const ly = STAFF_Y_START + s * STEP_HEIGHT;
              lines.push(
                <line
                  key={`bot-${s}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke={staffColor}
                  strokeWidth="1"
                />,
              );
            }
            return lines;
          };

          return (
            <g
              key={index}
              id={`note-${index}`}
              onClick={onNoteClick ? () => onNoteClick(noteName) : undefined}
              style={onNoteClick ? { cursor: "pointer" } : undefined}
            >
              {/* Hit area */}
              {onNoteClick && (
                <rect
                  x={x - noteSpacing / 2}
                  y={0}
                  width={noteSpacing}
                  height={height}
                  fill="transparent"
                />
              )}

              {renderLedgerLines()}

              {/* Accidental (♯/♭) to the left of the note head */}
              {accidental !== 0 && (
                <text
                  x={x - 19}
                  y={cy + 5}
                  fontFamily="serif"
                  fontSize="16"
                  fill={currentNoteColor}
                  textAnchor="middle"
                >
                  {accidental === 1 ? "♯" : "♭"}
                </text>
              )}

              {/* Note Head */}
              <ellipse
                cx={x}
                cy={cy}
                rx={7}
                ry={5}
                fill={currentNoteColor}
                transform={`rotate(-20 ${x} ${cy})`}
              />

              {/* Stem */}
              {/* Stem direction: usually down for B4 (center line) and above, up for below */}
              {step <= 4 ? (
                // Stem Down (from left side)
                <line
                  x1={x - 6}
                  y1={cy}
                  x2={x - 6}
                  y2={cy + 35}
                  stroke={currentNoteColor}
                  strokeWidth="1.5"
                />
              ) : (
                // Stem Up (from right side)
                <line
                  x1={x + 6}
                  y1={cy}
                  x2={x + 6}
                  y2={cy - 35}
                  stroke={currentNoteColor}
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
