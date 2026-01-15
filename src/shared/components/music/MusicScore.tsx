import { useEffect, useRef } from "react";

// Map French note names to vertical steps relative to top line F5 (step 0)
// Positive goes down (lower pitch), Negative goes up (higher pitch).
// Step = distance in half-spaces (note heads)
const NOTE_POSITIONS: Record<string, { step: number }> = {
  "Si♭ Grave": { step: 11 },
  "Si Grave": { step: 11 },

  Do: { step: 10 },
  "Do#": { step: 10 },

  Ré: { step: 9 },
  "Mi♭": { step: 8 },
  Mi: { step: 8 },
  Fa: { step: 7 },
  "Fa#": { step: 7 },
  Sol: { step: 6 },
  "Sol#": { step: 6 },
  La: { step: 5 },
  "Si♭": { step: 4 },
  Si: { step: 4 },

  "Do Aigu": { step: 3 },
  "Do# Aigu": { step: 3 },
  "Ré Aigu": { step: 2 },
  "Mi♭ Aigu": { step: 1 },
  "Mi Aigu": { step: 1 },
  "Fa Aigu": { step: 0 },
  "Sol Aigu": { step: -1 },
};

interface MusicScoreProps {
  notes: string[];
  activeNote?: string;
  onNoteClick: (note: string) => void;
}

export const MusicScore = ({
  notes,
  activeNote,
  onNoteClick,
}: MusicScoreProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active note
  useEffect(() => {
    if (activeNote && containerRef.current) {
      // Find the active note element index
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
  const NOTE_SPACING = 50;
  const START_OFFSET = 60; // Space for Clef

  const width = START_OFFSET + notes.length * NOTE_SPACING + 40;
  const height = 160;

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
          stroke="#374151" // gray-700
          strokeWidth="1"
        />,
      );
    }
    return lines;
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto bg-base-100 rounded-xl shadow-inner border border-base-300 p-4"
      style={{ scrollBehavior: "smooth" }}
    >
      <svg width={width} height={height} className="mx-auto block">
        {renderStaffLines()}

        {/* Treble Clef */}
        <text
          x={10}
          y={STAFF_Y_START + 4 * LINE_SPACING - 5}
          fontFamily="serif"
          fontSize="65"
          fill="#1f2937" // gray-800
        >
          𝄞
        </text>

        {notes.map((noteName, index) => {
          const pos = NOTE_POSITIONS[noteName];
          if (!pos) return null;

          const x = START_OFFSET + index * NOTE_SPACING;
          // Calculate Y based on step relative to top line (F5)
          const cy = STAFF_Y_START + pos.step * STEP_HEIGHT;

          const isActive = noteName === activeNote;
          const noteColor = isActive ? "#2563EB" : "#1f2937"; // blue-600 vs gray-800

          // Ledger lines
          const renderLedgerLines = () => {
            const lines = [];
            // Top ledger lines (if step <= -2) (A5 and above)
            for (let s = -2; s >= pos.step; s -= 2) {
              const ly = STAFF_Y_START + s * STEP_HEIGHT;
              lines.push(
                <line
                  key={`top-${s}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke="#374151"
                  strokeWidth="1"
                />,
              );
            }

            // Bottom ledger lines (if step >= 10) (C4 and below)
            for (let s = 10; s <= pos.step; s += 2) {
              const ly = STAFF_Y_START + s * STEP_HEIGHT;
              lines.push(
                <line
                  key={`bot-${s}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke="#374151"
                  strokeWidth="1"
                />,
              );
            }
            return lines;
          };

          return (
            <g
              key={noteName}
              id={`note-${index}`}
              onClick={() => onNoteClick(noteName)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              {/* Hit area */}
              <rect
                x={x - 25}
                y={0}
                width={50}
                height={height}
                fill="transparent"
              />

              {renderLedgerLines()}

              {/* Note Head */}
              <ellipse
                cx={x}
                cy={cy}
                rx={7}
                ry={5}
                fill={noteColor}
                transform={`rotate(-20 ${x} ${cy})`}
              />

              {/* Stem */}
              {/* Stem direction: usually down for B4 (center line) and above, up for below */}
              {pos.step <= 4 ? (
                // Stem Down (from left side)
                <line
                  x1={x - 6}
                  y1={cy}
                  x2={x - 6}
                  y2={cy + 35}
                  stroke={noteColor}
                  strokeWidth="1.5"
                />
              ) : (
                // Stem Up (from right side)
                <line
                  x1={x + 6}
                  y1={cy}
                  x2={x + 6}
                  y2={cy - 35}
                  stroke={noteColor}
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
