import { useId } from "react";
import { FluteKeys } from "./fingerings";
import { ChartTheme, chartTheme } from "../chartTheme";
import { KeyLegend } from "../KeyLegend";

interface FluteFingeringChartProps {
  keys?: Partial<FluteKeys>;
  className?: string;
  height?: number;
  darkMode?: boolean;
}

const keyFill = (pressed: boolean | undefined, theme: ChartTheme) =>
  pressed ? theme.pressed : theme.keyWhite;

interface KeyLabel {
  x: number;
  y: number;
  size: number;
  text: string;
  bold?: boolean;
}

// Schematic geometry (vertical, top = head joint) keyed by FluteKeys field.

// Main finger keys (round cups on the tube)
const FINGER_KEYS: {
  key: keyof FluteKeys;
  cx: number;
  cy: number;
  label: KeyLabel;
}[] = [
  { key: "l1", cx: 100, cy: 175, label: { x: 62, y: 178, size: 9, text: "L1", bold: true } },
  { key: "l2", cx: 100, cy: 225, label: { x: 62, y: 228, size: 9, text: "L2", bold: true } },
  { key: "l3", cx: 100, cy: 275, label: { x: 62, y: 278, size: 9, text: "L3", bold: true } },
  { key: "r1", cx: 100, cy: 385, label: { x: 120, y: 388, size: 9, text: "R1", bold: true } },
  { key: "r2", cx: 100, cy: 435, label: { x: 120, y: 438, size: 9, text: "R2", bold: true } },
  { key: "r3", cx: 100, cy: 485, label: { x: 120, y: 488, size: 9, text: "R3", bold: true } },
];

// Thumb keys (back of the tube, drawn on the left)
const THUMB_KEYS: {
  key: keyof FluteKeys;
  x: number;
  y: number;
  width: number;
  height: number;
  label: KeyLabel;
}[] = [
  { key: "thumbB", x: 28, y: 165, width: 16, height: 26, label: { x: 12, y: 181, size: 8, text: "Si" } },
  { key: "thumbBb", x: 28, y: 197, width: 16, height: 18, label: { x: 8, y: 210, size: 8, text: "Si♭" } },
];

// Pinky keys (side spatulas) and foot-joint rollers
const SIDE_KEYS: {
  key: keyof FluteKeys;
  link: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  label: KeyLabel;
}[] = [
  { key: "gSharp", link: "M 110 282 Q 120 292 128 300", cx: 134, cy: 306, rx: 6, ry: 10, label: { x: 146, y: 309, size: 8, text: "Sol#" } },
  { key: "dSharp", link: "M 110 492 Q 120 502 128 510", cx: 134, cy: 516, rx: 6, ry: 10, label: { x: 146, y: 519, size: 8, text: "Mi♭" } },
];

const FOOT_KEYS: {
  key: keyof FluteKeys;
  x: number;
  y: number;
  width: number;
  height: number;
  label: KeyLabel;
}[] = [
  { key: "lowCSharp", x: 116, y: 545, width: 20, height: 14, label: { x: 142, y: 556, size: 8, text: "Do#" } },
  { key: "lowC", x: 116, y: 565, width: 20, height: 14, label: { x: 142, y: 576, size: 8, text: "Do" } },
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

export const FluteFingeringChart = ({
  keys = {},
  className = "",
  height = 600,
  darkMode = false,
}: FluteFingeringChartProps) => {
  const uid = useId();
  const silverGrad = `${uid}-silverGrad`;

  const theme = chartTheme(darkMode);
  const tubeEdge = darkMode ? "#4b5563" : "#9ca3af";

  return (
    <svg
      viewBox="0 0 200 700"
      className={className}
      style={{ height: height, width: "auto", maxHeight: "100%" }}
    >
      <defs>
        {/* Silver tube gradient */}
        <linearGradient id={silverGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darkMode ? "#6b7280" : "#9CA3AF"} />
          <stop offset="30%" stopColor={darkMode ? "#9ca3af" : "#E5E7EB"} />
          <stop offset="50%" stopColor={darkMode ? "#d1d5db" : "#F9FAFB"} />
          <stop offset="70%" stopColor={darkMode ? "#9ca3af" : "#E5E7EB"} />
          <stop offset="100%" stopColor={darkMode ? "#6b7280" : "#9CA3AF"} />
        </linearGradient>
      </defs>

      {/* ========== FLUTE BODY (silver tube, head joint at the top) ========== */}

      {/* Tube shadow */}
      <rect
        x={91}
        y={33}
        width={20}
        height={590}
        rx={10}
        fill="rgba(0,0,0,0.25)"
      />
      {/* Tube */}
      <rect
        x={88}
        y={30}
        width={20}
        height={590}
        rx={10}
        fill={`url(#${silverGrad})`}
        stroke={tubeEdge}
        strokeWidth="1"
      />
      {/* Head joint crown */}
      <rect
        x={86}
        y={30}
        width={24}
        height={10}
        rx={4}
        fill={`url(#${silverGrad})`}
        stroke={tubeEdge}
        strokeWidth="1"
      />
      {/* Embouchure (lip plate + blow hole) */}
      <ellipse
        cx={98}
        cy={70}
        rx={13}
        ry={9}
        fill={`url(#${silverGrad})`}
        stroke={tubeEdge}
        strokeWidth="1"
      />
      <ellipse
        cx={98}
        cy={70}
        rx={6}
        ry={4}
        fill={darkMode ? "#111827" : "#1f2937"}
      />
      {/* Joint rings */}
      <rect x={86} y={130} width={24} height={4} rx={2} fill={tubeEdge} />
      <rect x={86} y={530} width={24} height={4} rx={2} fill={tubeEdge} />

      {/* ========== LEFT HAND ========== */}
      <Label
        label={{ x: 18, y: 150, size: 9, text: "Main gauche", bold: true }}
        theme={theme}
      />

      {/* Thumb keys (back of the tube) */}
      {THUMB_KEYS.map(({ key, x, y, width, height: h, label }) => (
        <g key={key}>
          <rect
            x={x}
            y={y}
            width={width}
            height={h}
            rx={5}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}
      {/* Thumb key linkage */}
      <path
        d="M 44 180 Q 65 178 88 176"
        stroke={theme.keyBorder}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      <Label
        label={{ x: 18, y: 360, size: 9, text: "Main droite", bold: true }}
        theme={theme}
      />

      {/* ========== FINGER KEYS ========== */}
      {FINGER_KEYS.map(({ key, cx, cy, label }) => (
        <g key={key}>
          <circle
            cx={cx}
            cy={cy}
            r={11}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}

      {/* Pinky keys */}
      {SIDE_KEYS.map(({ key, link, cx, cy, rx, ry, label }) => (
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

      {/* Foot joint rollers */}
      <Label
        label={{ x: 18, y: 570, size: 9, text: "Patte", bold: true }}
        theme={theme}
      />
      {FOOT_KEYS.map(({ key, x, y, width, height: h, label }) => (
        <g key={key}>
          <rect
            x={x}
            y={y}
            width={width}
            height={h}
            rx={4}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}

      <KeyLegend theme={theme} transform="translate(50, 660)" />
    </svg>
  );
};
