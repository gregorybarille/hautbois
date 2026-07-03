import { useId } from "react";
import { KeyState, OboeKeys } from "./fingerings";
import { ChartTheme, chartTheme } from "../chartTheme";
import { KeyLegend } from "../KeyLegend";

interface OboeFingeringChartProps {
  keys?: Partial<OboeKeys>;
  className?: string;
  height?: number;
  darkMode?: boolean;
}

type KeyStatus = boolean | KeyState | undefined;

const isPressed = (status: KeyStatus) => status === true || status === "closed";

const keyFill = (status: KeyStatus, theme: ChartTheme) =>
  isPressed(status) ? theme.pressed : theme.keyWhite;

interface KeyLabel {
  x: number;
  y: number;
  size: number;
  text: string;
  bold?: boolean;
}

// Static geometry of the drawing, keyed by the OboeKeys field it reflects.

// Thumb/side octave keys (small ellipses at the top left)
const OCTAVE_KEYS: {
  key: keyof OboeKeys;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  label: KeyLabel;
}[] = [
  { key: "octave1", cx: 35, cy: 68, rx: 8, ry: 5, label: { x: 18, y: 71, size: 8, text: "1" } },
  { key: "octave2", cx: 45, cy: 88, rx: 6, ry: 4, label: { x: 52, y: 91, size: 7, text: "2" } },
  { key: "octave3", cx: 25, cy: 88, rx: 6, ry: 4, label: { x: 12, y: 91, size: 7, text: "3" } },
];

// Main finger holes (L1 is drawn separately: it supports the half-hole)
const FINGER_HOLES: {
  key: keyof OboeKeys;
  cx: number;
  cy: number;
  label: KeyLabel;
}[] = [
  { key: "l2", cx: 100, cy: 165, label: { x: 62, y: 168, size: 9, text: "L2", bold: true } },
  { key: "l3", cx: 100, cy: 220, label: { x: 62, y: 223, size: 9, text: "L3", bold: true } },
  { key: "r1", cx: 100, cy: 320, label: { x: 120, y: 323, size: 9, text: "R1", bold: true } },
  { key: "r2", cx: 100, cy: 380, label: { x: 120, y: 383, size: 9, text: "R2", bold: true } },
  { key: "r3", cx: 100, cy: 440, label: { x: 120, y: 443, size: 9, text: "R3", bold: true } },
];

// Side and pinky keys: a linkage path plus an ellipse-shaped touchpiece
const SPATULA_KEYS: {
  key: keyof OboeKeys;
  link: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  label: KeyLabel;
}[] = [
  { key: "leftEb", link: "M 110 115 L 125 120", cx: 132, cy: 125, rx: 6, ry: 10, label: { x: 142, y: 128, size: 8, text: "Mib" } },
  { key: "gSharp", link: "M 110 225 Q 118 232 125 240", cx: 132, cy: 248, rx: 6, ry: 10, label: { x: 142, y: 251, size: 8, text: "Sol#" } },
  { key: "c", link: "M 110 448 Q 120 458 130 468", cx: 138, cy: 475, rx: 6, ry: 10, label: { x: 148, y: 478, size: 8, text: "Do" } },
  { key: "cSharp", link: "M 138 484 L 145 495", cx: 148, cy: 502, rx: 5, ry: 8, label: { x: 156, y: 505, size: 7, text: "Do#" } },
  { key: "rightEb", link: "M 138 484 L 135 515", cx: 133, cy: 522, rx: 5, ry: 9, label: { x: 142, y: 525, size: 7, text: "Mib" } },
  { key: "lowB", link: "M 86 448 Q 72 475 62 502", cx: 58, cy: 510, rx: 6, ry: 10, label: { x: 38, y: 513, size: 8, text: "Si" } },
  { key: "lowBb", link: "M 58 519 L 52 530", cx: 48, cy: 538, rx: 5, ry: 8, label: { x: 28, y: 541, size: 7, text: "Sib" } },
];

const Label = ({ label, theme }: { label: KeyLabel; theme: ChartTheme }) => (
  <text
    x={label.x}
    y={label.y}
    fontSize={label.size}
    fontWeight={label.bold ? 600 : undefined}
    fill={theme.text}
    fontFamily="system-ui"
  >
    {label.text}
  </text>
);

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

  const theme = chartTheme(darkMode);
  const l1Status: KeyStatus = keys.l1 ?? "open";

  return (
    <svg
      viewBox="0 0 200 700"
      className={className}
      style={{ height: height, width: "auto", maxHeight: "100%" }}
    >
      <defs>
        {/* Half hole gradient - HORIZONTAL split (top white, bottom violet) */}
        <linearGradient id={ids.halfGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.keyWhite} />
          <stop offset="45%" stopColor={theme.keyWhite} />
          <stop offset="55%" stopColor={theme.pressed} />
          <stop offset="100%" stopColor={theme.pressed} />
        </linearGradient>
      </defs>

      <OboeBody ids={ids} darkMode={darkMode} />

      {/* ========== OCTAVE KEYS (Back/Thumb Left) ========== */}
      <Label
        label={{ x: 20, y: 50, size: 9, text: "Octaves", bold: true }}
        theme={theme}
      />

      {/* Octave key mechanism rod */}
      <path
        d="M 35 68 L 35 95"
        stroke={theme.keyBorder}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Connection to body */}
      <path
        d="M 43 68 Q 58 70 78 78"
        stroke={theme.keyBorder}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {OCTAVE_KEYS.map(({ key, cx, cy, rx, ry, label }) => (
        <g key={key}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}

      {/* ========== FINGER HOLES ========== */}

      {/* L1 - First finger with half-hole mechanism */}
      <g>
        <circle
          cx={100}
          cy={110}
          r={10}
          fill={
            l1Status === "half"
              ? `url(#${ids.halfGrad})`
              : keyFill(l1Status, theme)
          }
          stroke={theme.keyBorder}
          strokeWidth="1"
        />
        <Label
          label={{ x: 62, y: 113, size: 9, text: "L1", bold: true }}
          theme={theme}
        />
      </g>

      {FINGER_HOLES.map(({ key, cx, cy, label }) => (
        <g key={key}>
          <circle
            cx={cx}
            cy={cy}
            r={10}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}

      {/* Left F key - rectangular touchpiece between L2 and L3 */}
      <g>
        <path
          d="M 82 172 Q 75 178 70 185"
          stroke={theme.keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x={60}
          y={183}
          width={10}
          height={26}
          rx={5}
          fill={keyFill(keys.leftF, theme)}
          stroke={theme.keyBorder}
          strokeWidth="1"
        />
        <Label label={{ x: 40, y: 198, size: 8, text: "Fa" }} theme={theme} />
      </g>

      {/* ========== SIDE & PINKY KEYS ========== */}

      {SPATULA_KEYS.map(({ key, link, cx, cy, rx, ry, label }) => (
        <g key={key}>
          <path
            d={link}
            stroke={theme.keyBorder}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}

      {/* Banana key (curved touchpiece, drawn as a stroked path) */}
      <g>
        <path
          d="M 86 448 Q 75 450 65 455"
          stroke={theme.keyBorder}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 60 455 Q 55 465 58 475"
          fill="none"
          stroke={keyFill(keys.banana, theme)}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 60 455 Q 55 465 58 475"
          fill="none"
          stroke={theme.keyBorder}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <Label label={{ x: 35, y: 468, size: 8, text: "Ban" }} theme={theme} />
      </g>

      <KeyLegend
        theme={theme}
        halfGradientId={ids.halfGrad}
        transform="translate(25, 640)"
      />
    </svg>
  );
};

// Static drawing of the instrument body (African blackwood, ivory rings, bell)
const OboeBody = ({
  ids,
  darkMode,
}: {
  ids: Record<string, string>;
  darkMode: boolean;
}) => {
  const woodDarkest = darkMode ? "#0a0a0a" : "#0D0806";
  const woodDark = darkMode ? "#1a1210" : "#1A1210";
  const woodMid = darkMode ? "#2a1f1a" : "#2A1F1A";
  const woodLight = darkMode ? "#3d2e25" : "#3D2E25";
  const woodHighlight = darkMode ? "#5a4035" : "#5A4035";
  const holeBlack = darkMode ? "#000000" : "#050302";

  return (
    <>
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
      <path
        d="M 90 28 L 85 265 L 115 265 L 110 28 Z"
        fill={`url(#${ids.bodyShine})`}
      />

      {/* Top ring - ivory/bone decorative ring */}
      <ellipse cx="100" cy="28" rx="11" ry="3" fill={woodDarkest} />
      <ellipse
        cx="100"
        cy="27"
        rx="10"
        ry="2.5"
        fill={`url(#${ids.ivoryGrad})`}
      />

      {/* Cork tenon ring at joint */}
      <rect
        x="84"
        y="258"
        width="32"
        height="8"
        rx="1"
        fill={`url(#${ids.corkGrad})`}
      />

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
      <ellipse
        cx="100"
        cy="276"
        rx="15"
        ry="3"
        fill={`url(#${ids.ivoryGrad})`}
      />

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
      <ellipse
        cx="100"
        cy="604"
        rx="34"
        ry="7"
        fill={`url(#${ids.ivoryGrad})`}
      />

      {/* Bell opening */}
      <ellipse cx="100" cy="605" rx="28" ry="5" fill={holeBlack} />
    </>
  );
};
