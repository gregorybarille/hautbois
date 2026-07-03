import { useId } from "react";
import { OboeKeys } from "../../constants/oboeFingerings";

interface OboeFingeringChartProps {
  keys?: Partial<OboeKeys>;
  className?: string;
  height?: number;
  darkMode?: boolean;
}

type KeyStatus = boolean | "open" | "closed" | "half";

export const OboeFingeringChart = ({
  keys = {},
  className = "",
  height = 600,
  darkMode = false,
}: OboeFingeringChartProps) => {
  const uid = useId();
  const ids = {
    woodGrad: `${uid}-woodGrad`,
    woodGrainVertical: `${uid}-woodGrainVertical`,
    halfGrad: `${uid}-halfGrad`,
    bodyShine: `${uid}-bodyShine`,
    ivoryGrad: `${uid}-ivoryGrad`,
    corkGrad: `${uid}-corkGrad`,
  };

  const isPressed = (status: KeyStatus) =>
    status === true || status === "closed";
  const isHalf = (status: KeyStatus) => status === "half";

  // Colors - African blackwood oboe with warm tones
  const woodDarkest = darkMode ? "#0a0a0a" : "#0D0806";
  const woodDark = darkMode ? "#1a1210" : "#1A1210";
  const woodMid = darkMode ? "#2a1f1a" : "#2A1F1A";
  const woodLight = darkMode ? "#3d2e25" : "#3D2E25";
  const woodHighlight = darkMode ? "#5a4035" : "#5A4035";

  // Nickel silver keys - simple white
  const keyWhite = darkMode ? "#e5e5e5" : "#FFFFFF";
  const keyBorder = darkMode ? "#666666" : "#888888";

  // State colors - darker violet when pressed
  const pressedColor = "#8B5CF6"; // violet plus foncé
  const holeBlack = darkMode ? "#000000" : "#050302";
  const textColor = darkMode ? "#e5e5e5" : "#4B5563";

  return (
    <svg
      viewBox="0 0 200 700"
      className={className}
      style={{ height: height, width: "auto", maxHeight: "100%" }}
    >
      <defs>
        {/* African blackwood gradient - realistic wood grain */}
        <linearGradient id={ids.woodGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={woodDarkest} />
          <stop offset="15%" stopColor={woodDark} />
          <stop offset="35%" stopColor={woodMid} />
          <stop offset="50%" stopColor={woodLight} />
          <stop offset="65%" stopColor={woodMid} />
          <stop offset="85%" stopColor={woodDark} />
          <stop offset="100%" stopColor={woodDarkest} />
        </linearGradient>

        {/* Vertical wood grain texture */}
        <linearGradient
          id={ids.woodGrainVertical}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={woodMid} stopOpacity="0.1" />
          <stop offset="25%" stopColor={woodDark} stopOpacity="0.05" />
          <stop offset="50%" stopColor={woodMid} stopOpacity="0.1" />
          <stop offset="75%" stopColor={woodDark} stopOpacity="0.05" />
          <stop offset="100%" stopColor={woodMid} stopOpacity="0.1" />
        </linearGradient>

        {/* Half hole gradient - HORIZONTAL split (top white, bottom violet) */}
        <linearGradient id={ids.halfGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={keyWhite} />
          <stop offset="45%" stopColor={keyWhite} />
          <stop offset="55%" stopColor={pressedColor} />
          <stop offset="100%" stopColor={pressedColor} />
        </linearGradient>

        {/* Cylindrical shine for wood body */}
        <linearGradient id={ids.bodyShine} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor={woodHighlight} stopOpacity="0.15" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="70%" stopColor={woodHighlight} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Ivory/bone ring gradient */}
        <linearGradient id={ids.ivoryGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4C8B8" />
          <stop offset="30%" stopColor="#F5F0E6" />
          <stop offset="50%" stopColor="#FFFAF0" />
          <stop offset="70%" stopColor="#F5F0E6" />
          <stop offset="100%" stopColor="#D4C8B8" />
        </linearGradient>

        {/* Cork texture for joints */}
        <linearGradient id={ids.corkGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="50%" stopColor="#A08060" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>
      </defs>

      {/* ========== OBOE BODY ========== */}

      {/* Main body shadow */}
      <path
        d="M 90 28 L 85 265 L 115 265 L 110 28 Z"
        fill="rgba(0,0,0,0.3)"
        transform="translate(3, 3)"
      />

      {/* Upper joint - staple area */}
      <path
        d="M 94 10 L 90 28 L 110 28 L 106 10 Z"
        fill={woodDark}
        stroke={woodDarkest}
        strokeWidth="0.5"
      />

      {/* Upper joint - main body with realistic taper */}
      <path
        d="M 90 28 L 85 265 L 115 265 L 110 28 Z"
        fill={`url(#${ids.woodGrad})`}
        stroke={woodDarkest}
        strokeWidth="1"
      />
      {/* Wood grain texture overlay */}
      <path
        d="M 90 28 L 85 265 L 115 265 L 110 28 Z"
        fill={`url(#${ids.woodGrainVertical})`}
      />
      {/* Cylindrical shine */}
      <path d="M 90 28 L 85 265 L 115 265 L 110 28 Z" fill={`url(#${ids.bodyShine})`} />

      {/* Top ring - ivory/bone decorative ring */}
      <ellipse cx="100" cy="28" rx="11" ry="3" fill={woodDarkest} />
      <ellipse cx="100" cy="27" rx="10" ry="2.5" fill={`url(#${ids.ivoryGrad})`} />

      {/* Cork tenon ring at joint */}
      <rect x="84" y="258" width="32" height="8" rx="1" fill={`url(#${ids.corkGrad})`} />

      {/* Upper tenon ring */}
      <ellipse cx="100" cy="265" rx="16" ry="4" fill={woodDarkest} />
      <ellipse cx="100" cy="264" rx="15" ry="3" fill={woodMid} />

      {/* Lower joint shadow */}
      <path
        d="M 85 275 L 78 555 L 122 555 L 115 275 Z"
        fill="rgba(0,0,0,0.3)"
        transform="translate(3, 3)"
      />

      {/* Lower joint - with realistic taper */}
      <path
        d="M 85 275 L 78 555 L 122 555 L 115 275 Z"
        fill={`url(#${ids.woodGrad})`}
        stroke={woodDarkest}
        strokeWidth="1"
      />
      <path
        d="M 85 275 L 78 555 L 122 555 L 115 275 Z"
        fill={`url(#${ids.woodGrainVertical})`}
      />
      <path
        d="M 85 275 L 78 555 L 122 555 L 115 275 Z"
        fill={`url(#${ids.bodyShine})`}
      />

      {/* Socket ring */}
      <ellipse cx="100" cy="275" rx="16" ry="4" fill={woodDarkest} />
      <ellipse cx="100" cy="276" rx="15" ry="3" fill={`url(#${ids.ivoryGrad})`} />

      {/* Bell shadow */}
      <path
        d="M 78 555 Q 72 580 65 605 Q 100 615 135 605 Q 128 580 122 555 Z"
        fill="rgba(0,0,0,0.3)"
        transform="translate(3, 3)"
      />

      {/* Bell - flared shape */}
      <path
        d="M 78 555 Q 72 580 65 605 Q 100 615 135 605 Q 128 580 122 555 Z"
        fill={`url(#${ids.woodGrad})`}
        stroke={woodDarkest}
        strokeWidth="1"
      />
      <path
        d="M 78 555 Q 72 580 65 605 Q 100 615 135 605 Q 128 580 122 555 Z"
        fill={`url(#${ids.bodyShine})`}
      />

      {/* Bell rim - ivory ring */}
      <ellipse cx="100" cy="605" rx="35" ry="8" fill={woodDarkest} />
      <ellipse cx="100" cy="604" rx="34" ry="7" fill={`url(#${ids.ivoryGrad})`} />

      {/* Bell opening */}
      <ellipse cx="100" cy="605" rx="28" ry="5" fill={holeBlack} />

      {/* ========== OCTAVE KEYS (Back/Thumb Left) ========== */}

      {/* Label */}
      <text
        x="20"
        y="50"
        fontSize="9"
        fontWeight="600"
        fill={textColor}
        fontFamily="system-ui"
      >
        Octaves
      </text>

      {/* Octave key mechanism rod */}
      <path
        d="M 35 68 L 35 95"
        stroke={keyBorder}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Octave 1 - Main octave key */}
      <ellipse
        cx="35"
        cy="68"
        rx="8"
        ry="5"
        fill={isPressed(keys.octave1 ?? false) ? pressedColor : keyWhite}
        stroke={keyBorder}
        strokeWidth="1"
      />
      {/* Connection to body */}
      <path
        d="M 43 68 Q 58 70 78 78"
        stroke={keyBorder}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <text x="18" y="71" fontSize="8" fill={textColor} fontFamily="system-ui">
        1
      </text>

      {/* Octave 2 */}
      <ellipse
        cx="45"
        cy="88"
        rx="6"
        ry="4"
        fill={isPressed(keys.octave2 ?? false) ? pressedColor : keyWhite}
        stroke={keyBorder}
        strokeWidth="1"
      />
      <text x="52" y="91" fontSize="7" fill={textColor} fontFamily="system-ui">
        2
      </text>

      {/* Octave 3 */}
      <ellipse
        cx="25"
        cy="88"
        rx="6"
        ry="4"
        fill={isPressed(keys.octave3 ?? false) ? pressedColor : keyWhite}
        stroke={keyBorder}
        strokeWidth="1"
      />
      <text x="12" y="91" fontSize="7" fill={textColor} fontFamily="system-ui">
        3
      </text>

      {/* ========== LEFT HAND - UPPER JOINT ========== */}

      {/* L1 - First finger with half-hole mechanism */}
      <g>
        <circle
          cx="100"
          cy="110"
          r="10"
          fill={
            isHalf(keys.l1 ?? "open")
              ? `url(#${ids.halfGrad})`
              : isPressed(keys.l1 ?? "open")
                ? pressedColor
                : keyWhite
          }
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="62"
          y="113"
          fontSize="9"
          fontWeight="600"
          fill={textColor}
          fontFamily="system-ui"
        >
          L1
        </text>
      </g>

      {/* Left Eb key - spatula key */}
      <g>
        <line
          x1="110"
          y1="115"
          x2="125"
          y2="120"
          stroke={keyBorder}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="132"
          cy="125"
          rx="6"
          ry="10"
          fill={isPressed(keys.leftEb ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="142"
          y="128"
          fontSize="8"
          fill={textColor}
          fontFamily="system-ui"
        >
          Mib
        </text>
      </g>

      {/* L2 - Second finger */}
      <g>
        <circle
          cx="100"
          cy="165"
          r="10"
          fill={isPressed(keys.l2 ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="62"
          y="168"
          fontSize="9"
          fontWeight="600"
          fill={textColor}
          fontFamily="system-ui"
        >
          L2
        </text>
      </g>

      {/* Left F key - between L2 and L3 */}
      <g>
        <path
          d="M 82 172 Q 75 178 70 185"
          stroke={keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="60"
          y="183"
          width="10"
          height="26"
          rx="5"
          fill={isPressed(keys.leftF ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="40"
          y="198"
          fontSize="8"
          fill={textColor}
          fontFamily="system-ui"
        >
          Fa
        </text>
      </g>

      {/* L3 - Third finger */}
      <g>
        <circle
          cx="100"
          cy="220"
          r="10"
          fill={isPressed(keys.l3 ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="62"
          y="223"
          fontSize="9"
          fontWeight="600"
          fill={textColor}
          fontFamily="system-ui"
        >
          L3
        </text>
      </g>

      {/* G# key (left pinky) */}
      <g>
        <path
          d="M 110 225 Q 118 232 125 240"
          stroke={keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="132"
          cy="248"
          rx="6"
          ry="10"
          fill={isPressed(keys.gSharp ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="142"
          y="251"
          fontSize="8"
          fill={textColor}
          fontFamily="system-ui"
        >
          Sol#
        </text>
      </g>

      {/* ========== RIGHT HAND - LOWER JOINT ========== */}

      {/* R1 - First finger */}
      <g>
        <circle
          cx="100"
          cy="320"
          r="10"
          fill={isPressed(keys.r1 ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="120"
          y="323"
          fontSize="9"
          fontWeight="600"
          fill={textColor}
          fontFamily="system-ui"
        >
          R1
        </text>
      </g>

      {/* R2 - Second finger */}
      <g>
        <circle
          cx="100"
          cy="380"
          r="10"
          fill={isPressed(keys.r2 ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="120"
          y="383"
          fontSize="9"
          fontWeight="600"
          fill={textColor}
          fontFamily="system-ui"
        >
          R2
        </text>
      </g>

      {/* R3 - Third finger */}
      <g>
        <circle
          cx="100"
          cy="440"
          r="10"
          fill={isPressed(keys.r3 ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="120"
          y="443"
          fontSize="9"
          fontWeight="600"
          fill={textColor}
          fontFamily="system-ui"
        >
          R3
        </text>
      </g>

      {/* Banana key (left side) */}
      <g>
        <path
          d="M 86 448 Q 75 450 65 455"
          stroke={keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 60 455 Q 55 465 58 475"
          fill="none"
          stroke={isPressed(keys.banana ?? false) ? pressedColor : keyWhite}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 60 455 Q 55 465 58 475"
          fill="none"
          stroke={keyBorder}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <text
          x="35"
          y="468"
          fontSize="8"
          fill={textColor}
          fontFamily="system-ui"
        >
          Ban
        </text>
      </g>

      {/* ========== RIGHT PINKY CLUSTER ========== */}

      {/* C key - top of cluster */}
      <g>
        <path
          d="M 110 448 Q 120 458 130 468"
          stroke={keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="138"
          cy="475"
          rx="6"
          ry="10"
          fill={isPressed(keys.c ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="148"
          y="478"
          fontSize="8"
          fill={textColor}
          fontFamily="system-ui"
        >
          Do
        </text>
      </g>

      {/* C# key - middle of cluster */}
      <g>
        <line
          x1="138"
          y1="484"
          x2="145"
          y2="495"
          stroke={keyBorder}
          strokeWidth="1.5"
        />
        <ellipse
          cx="148"
          cy="502"
          rx="5"
          ry="8"
          fill={isPressed(keys.cSharp ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="156"
          y="505"
          fontSize="7"
          fill={textColor}
          fontFamily="system-ui"
        >
          Do#
        </text>
      </g>

      {/* Right Eb key - bottom of cluster */}
      <g>
        <line
          x1="138"
          y1="484"
          x2="135"
          y2="515"
          stroke={keyBorder}
          strokeWidth="1.5"
        />
        <ellipse
          cx="133"
          cy="522"
          rx="5"
          ry="9"
          fill={isPressed(keys.rightEb ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="142"
          y="525"
          fontSize="7"
          fill={textColor}
          fontFamily="system-ui"
        >
          Mib
        </text>
      </g>

      {/* ========== LEFT PINKY - BELL KEYS ========== */}

      {/* Low B - upper bell key */}
      <g>
        <path
          d="M 86 448 Q 72 475 62 502"
          stroke={keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="58"
          cy="510"
          rx="6"
          ry="10"
          fill={isPressed(keys.lowB ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="38"
          y="513"
          fontSize="8"
          fill={textColor}
          fontFamily="system-ui"
        >
          Si
        </text>
      </g>

      {/* Low Bb - lower bell key */}
      <g>
        <line
          x1="58"
          y1="519"
          x2="52"
          y2="530"
          stroke={keyBorder}
          strokeWidth="1.5"
        />
        <ellipse
          cx="48"
          cy="538"
          rx="5"
          ry="8"
          fill={isPressed(keys.lowBb ?? false) ? pressedColor : keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="28"
          y="541"
          fontSize="7"
          fill={textColor}
          fontFamily="system-ui"
        >
          Sib
        </text>
      </g>

      {/* ========== LEGEND ========== */}
      <g transform="translate(25, 640)">
        {/* Legend background */}
        <rect
          x="-10"
          y="-15"
          width="160"
          height="35"
          rx="8"
          fill={darkMode ? "#1a1a1a" : "#F9FAFB"}
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="1"
        />

        {/* Open */}
        <circle
          cx="8"
          cy="0"
          r="7"
          fill={keyWhite}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text x="20" y="4" fontSize="9" fill={textColor} fontFamily="system-ui">
          Ouvert
        </text>

        {/* Closed */}
        <circle
          cx="70"
          cy="0"
          r="7"
          fill={pressedColor}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text x="82" y="4" fontSize="9" fill={textColor} fontFamily="system-ui">
          Fermé
        </text>

        {/* Half */}
        <circle
          cx="130"
          cy="0"
          r="7"
          fill={`url(#${ids.halfGrad})`}
          stroke={keyBorder}
          strokeWidth="1"
        />
        <text
          x="142"
          y="4"
          fontSize="9"
          fill={textColor}
          fontFamily="system-ui"
        >
          ½
        </text>
      </g>
    </svg>
  );
};
