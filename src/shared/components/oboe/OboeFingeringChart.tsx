import { OboeKeys } from "../../constants/oboeFingerings";

interface OboeFingeringChartProps {
  keys?: Partial<OboeKeys>;
  className?: string;
  height?: number;
}

type KeyStatus = boolean | "open" | "closed" | "half";

export const OboeFingeringChart = ({
  keys = {},
  className = "",
  height = 600,
}: OboeFingeringChartProps) => {
  const isPressed = (status: KeyStatus) =>
    status === true || status === "closed";
  const isHalf = (status: KeyStatus) => status === "half";

  // Colors - dark wood oboe
  const woodDark = "#1A0F0A";
  const woodMid = "#2D1810";
  const woodLight = "#3D2415";
  const metalLight = "#D4D4D4";
  const metalDark = "#A0A0A0";
  const pressedColor = "#1e293b";
  const holeColor = "#0A0603";

  return (
    <svg
      viewBox="0 0 200 700"
      className={className}
      style={{ height: height, width: "auto", maxHeight: "100%" }}
    >
      <defs>
        {/* Dark wood gradient */}
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={woodDark} />
          <stop offset="30%" stopColor={woodMid} />
          <stop offset="70%" stopColor={woodMid} />
          <stop offset="100%" stopColor={woodDark} />
        </linearGradient>

        {/* Metal gradient for keys */}
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metalLight} />
          <stop offset="50%" stopColor={metalDark} />
          <stop offset="100%" stopColor="#888888" />
        </linearGradient>

        {/* Pressed key gradient */}
        <linearGradient id="pressedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor={pressedColor} />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Half hole gradient */}
        <linearGradient id="halfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={metalLight} />
          <stop offset="50%" stopColor={pressedColor} />
          <stop offset="100%" stopColor={metalLight} />
        </linearGradient>

        {/* Shine effect */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={woodDark} stopOpacity="0.8" />
          <stop offset="40%" stopColor={woodLight} stopOpacity="0.3" />
          <stop offset="60%" stopColor={woodLight} stopOpacity="0.3" />
          <stop offset="100%" stopColor={woodDark} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* ========== OBOE BODY ========== */}

      {/* Upper joint - tapered */}
      <path
        d="M 88 30 L 84 260 L 116 260 L 112 30 Z"
        fill="url(#woodGrad)"
        stroke={woodDark}
        strokeWidth="1.5"
      />
      {/* Shine overlay */}
      <path
        d="M 88 30 L 84 260 L 116 260 L 112 30 Z"
        fill="url(#shine)"
        opacity="0.4"
      />

      {/* Joint rings */}
      <ellipse cx="100" cy="30" rx="14" ry="4" fill={woodDark} />
      <ellipse cx="100" cy="32" rx="13" ry="3" fill={woodLight} />
      <ellipse cx="100" cy="260" rx="18" ry="4" fill={woodDark} />
      <ellipse cx="100" cy="262" rx="17" ry="3" fill={woodLight} />

      {/* Lower joint - more tapered */}
      <path
        d="M 84 270 L 76 550 L 124 550 L 116 270 Z"
        fill="url(#woodGrad)"
        stroke={woodDark}
        strokeWidth="1.5"
      />
      <path
        d="M 84 270 L 76 550 L 124 550 L 116 270 Z"
        fill="url(#shine)"
        opacity="0.4"
      />

      {/* Joint ring */}
      <ellipse cx="100" cy="270" rx="18" ry="4" fill={woodDark} />
      <ellipse cx="100" cy="272" rx="17" ry="3" fill={woodLight} />

      {/* Bell */}
      <path
        d="M 76 550 Q 72 575 68 595 L 132 595 Q 128 575 124 550 Z"
        fill="url(#woodGrad)"
        stroke={woodDark}
        strokeWidth="1.5"
      />
      <ellipse cx="100" cy="595" rx="32" ry="7" fill={woodDark} />
      <ellipse cx="100" cy="596" rx="30" ry="5" fill={woodLight} />

      {/* ========== OCTAVE KEYS (Back/Thumb Left) ========== */}

      {/* Label */}
      <text x="25" y="52" fontSize="8" fontWeight="bold" fill="#6B7280">
        Octaves
      </text>

      {/* Octave 1 */}
      <circle
        cx="35"
        cy="72"
        r="7"
        fill={
          isPressed(keys.octave1 ?? false)
            ? "url(#pressedGrad)"
            : "url(#metalGrad)"
        }
        stroke="#505050"
        strokeWidth="1"
      />
      <line x1="42" y1="72" x2="78" y2="82" stroke="#666" strokeWidth="1.5" />
      <text x="22" y="75" fontSize="7" fill="#6B7280">
        1
      </text>

      {/* Octave 2 */}
      <circle
        cx="45"
        cy="90"
        r="5"
        fill={
          isPressed(keys.octave2 ?? false)
            ? "url(#pressedGrad)"
            : "url(#metalGrad)"
        }
        stroke="#505050"
        strokeWidth="1"
      />
      <line x1="40" y1="86" x2="35" y2="78" stroke="#666" strokeWidth="1" />
      <text x="52" y="93" fontSize="6" fill="#6B7280">
        2
      </text>

      {/* Octave 3 */}
      <circle
        cx="25"
        cy="90"
        r="5"
        fill={
          isPressed(keys.octave3 ?? false)
            ? "url(#pressedGrad)"
            : "url(#metalGrad)"
        }
        stroke="#505050"
        strokeWidth="1"
      />
      <line x1="30" y1="86" x2="35" y2="78" stroke="#666" strokeWidth="1" />
      <text x="14" y="93" fontSize="6" fill="#6B7280">
        3
      </text>

      {/* ========== LEFT HAND - UPPER JOINT ========== */}

      {/* L1 - First finger with plateau and half-hole */}
      <g>
        {/* Plateau ring */}
        <circle
          cx="100"
          cy="110"
          r="13"
          fill="none"
          stroke={isPressed(keys.l1 ?? "open") ? "#505050" : "#888"}
          strokeWidth={isPressed(keys.l1 ?? "open") ? 2.5 : 1.5}
        />
        {/* Center hole */}
        <circle
          cx="100"
          cy="110"
          r="7"
          fill={
            isHalf(keys.l1 ?? "open")
              ? "url(#halfGrad)"
              : isPressed(keys.l1 ?? "open")
                ? holeColor
                : metalLight
          }
          stroke="#505050"
          strokeWidth="1.5"
        />
        {isHalf(keys.l1 ?? "open") && (
          <path
            d="M 100 103 A 7 7 0 0 1 100 117"
            fill="none"
            stroke="#000"
            strokeWidth="2"
          />
        )}
        <text x="62" y="113" fontSize="9" fontWeight="600" fill="#4B5563">
          L1
        </text>
      </g>

      {/* Left Eb key - smaller round key */}
      <ellipse
        cx="135"
        cy="128"
        rx="7"
        ry="11"
        fill={
          isPressed(keys.leftEb ?? false)
            ? "url(#pressedGrad)"
            : "url(#metalGrad)"
        }
        stroke="#505050"
        strokeWidth="1"
      />
      <line
        x1="113"
        y1="116"
        x2="128"
        y2="122"
        stroke="#666"
        strokeWidth="1.5"
      />
      <text x="144" y="131" fontSize="7" fill="#6B7280">
        Eb
      </text>

      {/* L2 - Second finger with plateau */}
      <g>
        <circle
          cx="100"
          cy="165"
          r="13"
          fill="none"
          stroke={isPressed(keys.l2 ?? false) ? "#505050" : "#888"}
          strokeWidth={isPressed(keys.l2 ?? false) ? 2.5 : 1.5}
        />
        <circle
          cx="100"
          cy="165"
          r="7"
          fill={isPressed(keys.l2 ?? false) ? holeColor : metalLight}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="62" y="168" fontSize="9" fontWeight="600" fill="#4B5563">
          L2
        </text>
      </g>

      {/* Left F key - LONG FLAT KEY between L2 and L3 */}
      <g>
        {/* Long flat spatula key */}
        <rect
          x="58"
          y="185"
          width="12"
          height="28"
          rx="6"
          fill={
            isPressed(keys.leftF ?? false)
              ? "url(#pressedGrad)"
              : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        {/* Connection mechanism */}
        <line
          x1="82"
          y1="172"
          x2="70"
          y2="185"
          stroke="#666"
          strokeWidth="1.5"
        />
        {/* Highlight on key */}
        <rect
          x="60"
          y="187"
          width="4"
          height="24"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <text x="42" y="202" fontSize="7" fill="#6B7280">
          F
        </text>
      </g>

      {/* L3 - Third finger with plateau */}
      <g>
        <circle
          cx="100"
          cy="220"
          r="13"
          fill="none"
          stroke={isPressed(keys.l3 ?? false) ? "#505050" : "#888"}
          strokeWidth={isPressed(keys.l3 ?? false) ? 2.5 : 1.5}
        />
        <circle
          cx="100"
          cy="220"
          r="7"
          fill={isPressed(keys.l3 ?? false) ? holeColor : metalLight}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="62" y="223" fontSize="9" fontWeight="600" fill="#4B5563">
          L3
        </text>
      </g>

      {/* G# key (left pinky) - elongated */}
      <g>
        <ellipse
          cx="138"
          cy="248"
          rx="7"
          ry="13"
          fill={
            isPressed(keys.gSharp ?? false)
              ? "url(#pressedGrad)"
              : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        <line
          x1="113"
          y1="228"
          x2="131"
          y2="240"
          stroke="#666"
          strokeWidth="1.5"
        />
        <text x="147" y="251" fontSize="7" fill="#6B7280">
          G#
        </text>
      </g>

      {/* ========== RIGHT HAND - LOWER JOINT ========== */}

      {/* R1 - First finger with plateau */}
      <g>
        <circle
          cx="100"
          cy="320"
          r="13"
          fill="none"
          stroke={isPressed(keys.r1 ?? false) ? "#505050" : "#888"}
          strokeWidth={isPressed(keys.r1 ?? false) ? 2.5 : 1.5}
        />
        <circle
          cx="100"
          cy="320"
          r="7"
          fill={isPressed(keys.r1 ?? false) ? holeColor : metalLight}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="118" y="323" fontSize="9" fontWeight="600" fill="#4B5563">
          R1
        </text>
      </g>

      {/* R2 - Second finger with plateau */}
      <g>
        <circle
          cx="100"
          cy="380"
          r="13"
          fill="none"
          stroke={isPressed(keys.r2 ?? false) ? "#505050" : "#888"}
          strokeWidth={isPressed(keys.r2 ?? false) ? 2.5 : 1.5}
        />
        <circle
          cx="100"
          cy="380"
          r="7"
          fill={isPressed(keys.r2 ?? false) ? holeColor : metalLight}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="118" y="383" fontSize="9" fontWeight="600" fill="#4B5563">
          R2
        </text>
      </g>

      {/* R3 - Third finger with plateau */}
      <g>
        <circle
          cx="100"
          cy="440"
          r="13"
          fill="none"
          stroke={isPressed(keys.r3 ?? false) ? "#505050" : "#888"}
          strokeWidth={isPressed(keys.r3 ?? false) ? 2.5 : 1.5}
        />
        <circle
          cx="100"
          cy="440"
          r="7"
          fill={isPressed(keys.r3 ?? false) ? holeColor : metalLight}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="118" y="443" fontSize="9" fontWeight="600" fill="#4B5563">
          R3
        </text>
      </g>

      {/* Banana key (left side) - curved spatula */}
      <g>
        <path
          d="M 60 456 Q 55 465 57 474"
          fill="none"
          stroke={isPressed(keys.banana ?? false) ? pressedColor : metalDark}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="87"
          y1="448"
          x2="63"
          y2="456"
          stroke="#666"
          strokeWidth="1.5"
        />
        <text x="37" y="468" fontSize="7" fill="#6B7280">
          Ban
        </text>
      </g>

      {/* ========== RIGHT PINKY CLUSTER ========== */}

      {/* C key */}
      <g>
        <ellipse
          cx="143"
          cy="478"
          rx="7"
          ry="12"
          fill={
            isPressed(keys.c ?? false) ? "url(#pressedGrad)" : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        <line
          x1="113"
          y1="448"
          x2="136"
          y2="470"
          stroke="#666"
          strokeWidth="1.5"
        />
        <text x="152" y="481" fontSize="7" fill="#6B7280">
          C
        </text>
      </g>

      {/* C# key */}
      <g>
        <ellipse
          cx="153"
          cy="502"
          rx="6"
          ry="10"
          fill={
            isPressed(keys.cSharp ?? false)
              ? "url(#pressedGrad)"
              : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        <line
          x1="143"
          y1="488"
          x2="150"
          y2="494"
          stroke="#666"
          strokeWidth="1"
        />
        <text x="161" y="505" fontSize="6" fill="#6B7280">
          C#
        </text>
      </g>

      {/* Right Eb key */}
      <g>
        <ellipse
          cx="138"
          cy="522"
          rx="6"
          ry="11"
          fill={
            isPressed(keys.rightEb ?? false)
              ? "url(#pressedGrad)"
              : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        <line
          x1="143"
          y1="488"
          x2="140"
          y2="512"
          stroke="#666"
          strokeWidth="1"
        />
        <text x="146" y="525" fontSize="6" fill="#6B7280">
          Eb
        </text>
      </g>

      {/* ========== LEFT PINKY - BELL KEYS ========== */}

      {/* Low B */}
      <g>
        <ellipse
          cx="56"
          cy="512"
          rx="7"
          ry="11"
          fill={
            isPressed(keys.lowB ?? false)
              ? "url(#pressedGrad)"
              : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        <line
          x1="87"
          y1="448"
          x2="61"
          y2="504"
          stroke="#666"
          strokeWidth="1.5"
        />
        <text x="38" y="515" fontSize="7" fill="#6B7280">
          B
        </text>
      </g>

      {/* Low Bb */}
      <g>
        <ellipse
          cx="46"
          cy="537"
          rx="6"
          ry="10"
          fill={
            isPressed(keys.lowBb ?? false)
              ? "url(#pressedGrad)"
              : "url(#metalGrad)"
          }
          stroke="#505050"
          strokeWidth="1"
        />
        <line x1="56" y1="521" x2="49" y2="529" stroke="#666" strokeWidth="1" />
        <text x="28" y="540" fontSize="6" fill="#6B7280">
          Bb
        </text>
      </g>

      {/* ========== LEGEND ========== */}
      <g transform="translate(30, 635)">
        {/* Open */}
        <circle
          cx="0"
          cy="0"
          r="6"
          fill={metalLight}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="10" y="4" fontSize="8" fill="#4B5563">
          Ouvert
        </text>

        {/* Closed */}
        <circle
          cx="50"
          cy="0"
          r="6"
          fill={holeColor}
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="60" y="4" fontSize="8" fill="#4B5563">
          Fermé
        </text>

        {/* Half */}
        <circle
          cx="105"
          cy="0"
          r="6"
          fill="url(#halfGrad)"
          stroke="#505050"
          strokeWidth="1.5"
        />
        <text x="115" y="4" fontSize="8" fill="#4B5563">
          Demi
        </text>
      </g>

      {/* Title badge at top */}
      <rect
        x="65"
        y="5"
        width="70"
        height="18"
        rx="9"
        fill="#F9FAFB"
        stroke="#D1D5DB"
        strokeWidth="1"
      />
      <text
        x="100"
        y="17"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        fill="#374151"
      >
        Hautbois
      </text>
    </svg>
  );
};
