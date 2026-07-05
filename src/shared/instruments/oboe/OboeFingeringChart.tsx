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

// Schematic geometry (vertical, reed at the top) keyed by the OboeKeys field
// it reflects. Positions follow the instrument in file.svg / the labeled
// diagram in hautbois-realiste.svg: x' = (x - 485) * 0.42 + 100,
// y' = y * 0.42 - 69.8.

// Thumb/side octave keys. They live on the back of the instrument, so they
// keep their schematic cluster at the top left.
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

// Main finger plates on the body axis (L1 is drawn separately: it supports
// the half-hole), plus the low B / B-flat pad cups.
const FINGER_HOLES: {
  key: keyof OboeKeys;
  cx: number;
  cy: number;
  r: number;
  label: KeyLabel;
}[] = [
  { key: "l2", cx: 100, cy: 171.7, r: 10, label: { x: 68, y: 175, size: 9, text: "L2", bold: true } },
  { key: "l3", cx: 100, cy: 201.1, r: 10, label: { x: 68, y: 204.5, size: 9, text: "L3", bold: true } },
  { key: "r1", cx: 99.6, cy: 325, r: 10, label: { x: 122, y: 328.5, size: 9, text: "R1", bold: true } },
  { key: "r2", cx: 99.6, cy: 354.4, r: 10, label: { x: 122, y: 357.9, size: 9, text: "R2", bold: true } },
  { key: "r3", cx: 99.6, cy: 383.8, r: 10, label: { x: 122, y: 387.3, size: 9, text: "R3", bold: true } },
  { key: "lowB", cx: 100, cy: 456, r: 8, label: { x: 76, y: 459, size: 8, text: "Si" } },
  { key: "lowBb", cx: 100, cy: 511.9, r: 8.5, label: { x: 72, y: 515, size: 7, text: "Sib" } },
];

// Side and pinky touchpieces: a linkage path plus an ellipse touch.
const SPATULA_KEYS: {
  key: keyof OboeKeys;
  link: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  label: KeyLabel;
}[] = [
  { key: "leftEb", link: "M 86.5 286 L 82.5 286", cx: 77.5, cy: 286, rx: 7, ry: 5, label: { x: 53, y: 289, size: 8, text: "Mib" } },
  { key: "gSharp", link: "M 88.5 259 L 84.5 259", cx: 79.5, cy: 258.6, rx: 6.5, ry: 4.5, label: { x: 53, y: 262, size: 8, text: "Sol#" } },
  { key: "leftF", link: "M 87 362 L 84.5 362", cx: 81, cy: 362, rx: 5, ry: 7.5, label: { x: 62, y: 365, size: 8, text: "Fa" } },
  { key: "banana", link: "M 112.5 394.5 L 115 396.5", cx: 119, cy: 397.5, rx: 7.5, ry: 5.2, label: { x: 130, y: 400.5, size: 8, text: "Ban" } },
  { key: "c", link: "M 115.5 409.5 L 118.5 412.5", cx: 123.5, cy: 414, rx: 9.4, ry: 6, label: { x: 137, y: 417.5, size: 8, text: "Do" } },
  { key: "cSharp", link: "M 122.5 424.5 L 123.5 427", cx: 125, cy: 430.5, rx: 8.4, ry: 5.5, label: { x: 138, y: 434, size: 7, text: "Do#" } },
  { key: "rightEb", link: "M 117.5 440.5 L 119.5 443", cx: 121, cy: 445, rx: 6, ry: 4.2, label: { x: 131, y: 448, size: 7, text: "Mib" } },
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
    halfGrad: `${uid}-halfGrad`,
    caneGrad: `${uid}-caneGrad`,
    threadGrad: `${uid}-threadGrad`,
    stapleGrad: `${uid}-stapleGrad`,
    boreGrad: `${uid}-boreGrad`,
    softBlur: `${uid}-softBlur`,
  };

  const theme = chartTheme(darkMode);
  const l1Status: KeyStatus = keys.l1 ?? "open";

  return (
    <svg
      viewBox="0 -40 200 720"
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
        d="M 43 68 Q 62 72 90 80"
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

      {/* ========== FINGER PLATES & LOW PAD CUPS ========== */}

      {/* L1 - First finger with half-hole mechanism */}
      <g>
        <circle
          cx={100}
          cy={142.3}
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
          label={{ x: 68, y: 145.8, size: 9, text: "L1", bold: true }}
          theme={theme}
        />
      </g>

      {FINGER_HOLES.map(({ key, cx, cy, r, label }) => (
        <g key={key}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={keyFill(keys[key], theme)}
            stroke={theme.keyBorder}
            strokeWidth="1"
          />
          <Label label={label} theme={theme} />
        </g>
      ))}

      {/* ========== SIDE & PINKY TOUCHPIECES ========== */}

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

      <KeyLegend
        theme={theme}
        halfGradientId={ids.halfGrad}
        transform="translate(25, 640)"
      />
    </svg>
  );
};

// Realistic body, a faithful port of the traced photo in file.svg (via
// hautbois-realiste.svg): reed with pale scraped tip and dark staple, crown
// ("onion") top, slim grenadilla joints with polished highlights, metal band
// at the bell joint, flared bell with bronze rim edge, dark bore and interior
// reflection. The interactive keys stay schematic on top of it.
const OboeBody = ({
  ids,
  darkMode,
}: {
  ids: Record<string, string>;
  darkMode: boolean;
}) => {
  // Grenadilla reads near-black on light backgrounds; lift the darkest
  // stops and strengthen the rim light so the silhouette survives dark mode.
  const woodEdge = darkMode ? "#151110" : "#030303";
  const rimLightOpacity = darkMode ? 0.55 : 0.35;
  const shineOpacity = darkMode ? 0.18 : 0.13;
  const seamOpacity = darkMode ? 0.8 : 0.6;
  const bandFill = darkMode ? "#9ca3af" : "#c9ced4";
  const bandEdge = darkMode ? "#6b7280" : "#8a9097";

  return (
    <>
      <defs>
        {/* Grenadilla wood, cylindrical shading */}
        <linearGradient id={ids.woodGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={woodEdge} />
          <stop offset="0.12" stopColor={darkMode ? "#1c1614" : "#0c0a09"} />
          <stop offset="0.3" stopColor={darkMode ? "#292019" : "#1f1a15"} />
          <stop offset="0.44" stopColor="#3c3226" />
          <stop offset="0.5" stopColor="#514436" />
          <stop offset="0.56" stopColor="#372d22" />
          <stop offset="0.7" stopColor={darkMode ? "#201a16" : "#151110"} />
          <stop offset="0.88" stopColor={darkMode ? "#171310" : "#060505"} />
          <stop offset="1" stopColor={woodEdge} />
        </linearGradient>

        {/* Reed cane */}
        <linearGradient id={ids.caneGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b18549" />
          <stop offset="0.3" stopColor="#dcbe8a" />
          <stop offset="0.5" stopColor="#eedcae" />
          <stop offset="0.7" stopColor="#d6b67d" />
          <stop offset="1" stopColor="#9e7440" />
        </linearGradient>

        {/* Thread wrap */}
        <linearGradient id={ids.threadGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5f180f" />
          <stop offset="0.35" stopColor="#a53a2a" />
          <stop offset="0.5" stopColor="#c25640" />
          <stop offset="0.65" stopColor="#9c3324" />
          <stop offset="1" stopColor="#4f120b" />
        </linearGradient>

        {/* Dark staple below the wrap */}
        <linearGradient id={ids.stapleGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#17120e" />
          <stop offset="0.45" stopColor="#3b2f25" />
          <stop offset="0.6" stopColor="#4a3b2e" />
          <stop offset="1" stopColor="#120e0b" />
        </linearGradient>

        {/* Bell bore */}
        <radialGradient id={ids.boreGrad} cx="0.5" cy="0.45" r="0.65">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.7" stopColor="#0a0605" />
          <stop offset="0.92" stopColor="#2a1c14" />
          <stop offset="1" stopColor="#4a3320" />
        </radialGradient>

        <filter id={ids.softBlur} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      {/* ===== Reed ===== */}
      <path
        d="M 96.2 -29.1 C 96.2 -30.8 103.8 -30.8 103.8 -29.1 C 103.4 -19.4 103 -11 103 -3.4 L 97.1 -3.4 C 97.1 -11 96.6 -19.4 96.2 -29.1 Z"
        fill={`url(#${ids.caneGrad})`}
      />
      <path d="M 96.3 -28.7 L 103.7 -28.7 L 103.5 -18.6 L 96.5 -18.6 Z" fill="#f0e4c0" opacity="0.9" />
      <path d="M 96.7 -17.7 L 103.3 -17.7 L 103.1 -3.4 L 96.9 -3.4 Z" fill="#b08a4e" opacity="0.55" />
      <line x1="100" y1="-30" x2="100" y2="-3.8" stroke="#a87c49" strokeWidth="0.5" opacity="0.8" />
      {/* thread wrap */}
      <rect x="95.8" y="-3.8" width="8.4" height="15.1" rx="2.9" fill={`url(#${ids.threadGrad})`} />
      <g stroke="#63180e" strokeWidth="0.8" opacity="0.65">
        <line x1="96.2" y1="0.3" x2="103.8" y2="-1.8" />
        <line x1="96.2" y1="4.1" x2="103.8" y2="2" />
        <line x1="96.2" y1="7.9" x2="103.8" y2="5.8" />
      </g>
      {/* dark staple + metal collar */}
      <path d="M 97.1 10.8 L 96.6 23.9 L 103.4 23.9 L 103 10.8 Z" fill={`url(#${ids.stapleGrad})`} />
      <rect x="95.6" y="23" width="8" height="3.4" rx="1.3" fill={bandFill} stroke={bandEdge} strokeWidth="0.4" />

      {/* ===== Flared top of the upper joint ===== */}
      <path
        d="M 94 26.4 L 106 26.4 C 107.6 32.8 110.3 40 111.6 47.8 L 88.4 47.8 C 89.7 40 92.4 32.8 94 26.4 Z"
        fill={`url(#${ids.woodGrad})`}
      />
      <ellipse cx="100" cy="27.3" rx="3.4" ry="0.9" fill="#000" opacity="0.85" />
      <rect x="86.9" y="47.8" width="26.2" height="4.6" rx="1.9" fill={`url(#${ids.woodGrad})`} />
      <line x1="87.5" y1="48.4" x2="112.5" y2="48.4" stroke="#000" strokeWidth="0.5" opacity={seamOpacity} />

      {/* ===== Upper joint ===== */}
      <path d="M 88.2 52.4 L 87.2 278.8 L 112.8 278.8 L 111.8 52.4 Z" fill={`url(#${ids.woodGrad})`} />

      {/* ===== Centre tenon band ===== */}
      <rect x="85.4" y="277.1" width="29.2" height="8.8" rx="2.9" fill={`url(#${ids.woodGrad})`} />
      <line x1="86" y1="278.4" x2="113.4" y2="278.4" stroke="#000" strokeWidth="0.5" opacity={seamOpacity} />
      <line x1="86" y1="284.3" x2="113.4" y2="284.3" stroke="#000" strokeWidth="0.5" opacity={seamOpacity} />

      {/* ===== Lower joint ===== */}
      <path d="M 87 285.9 L 85.6 488.8 L 114.4 488.8 L 113 285.9 Z" fill={`url(#${ids.woodGrad})`} />

      {/* ===== Metal band at the bell joint ===== */}
      <rect x="83.6" y="487.1" width="32.8" height="7.1" rx="2.5" fill={bandFill} stroke={bandEdge} strokeWidth="0.5" />

      {/* ===== Bell ===== */}
      <path
        d="M 85 493.4 C 84.4 526.6 82 556 74.5 580.4 C 71.6 588.8 70.5 595.9 70.9 602.6 L 129.1 602.6 C 129.5 595.9 128.4 588.8 125.5 580.4 C 118 556 115.6 526.6 115 493.4 Z"
        fill={`url(#${ids.woodGrad})`}
      />
      <rect x="68.5" y="600.1" width="63" height="13.4" rx="6.7" fill={`url(#${ids.woodGrad})`} />
      <path
        d="M 70.2 608.1 C 71 611.4 80 613.5 100 613.5 C 120 613.5 129 611.4 129.8 608.1"
        fill="none"
        stroke="#6b4a2a"
        strokeWidth="1.3"
        opacity="0.65"
      />
      <ellipse cx="100" cy="611.4" rx="27.5" ry="4.6" fill={`url(#${ids.boreGrad})`} />
      {/* interior reflection */}
      <path
        d="M 84.9 588 C 86.6 583 94.1 581.4 98.3 583.9 C 100.8 585.6 104.2 582.2 107.6 583 C 110.9 583.9 110.1 587.3 105.9 588.9 C 98.3 591.9 88.2 591.5 84.9 588 Z"
        fill="#cfc8bd"
        opacity="0.45"
      />

      {/* ===== Polished-wood highlights & rim light ===== */}
      <rect x="94.5" y="56.2" width="2.1" height="216" fill="#fff" opacity={shineOpacity} filter={`url(#${ids.softBlur})`} />
      <rect x="93.7" y="289.3" width="2.5" height="195" fill="#fff" opacity={shineOpacity} filter={`url(#${ids.softBlur})`} />
      <path
        d="M 92 499.3 C 90.8 530.8 87.4 560.2 80.3 583.3 L 83.6 584.6 C 90.3 561 93.7 531.6 95 500.1 Z"
        fill="#fff"
        opacity="0.09"
        filter={`url(#${ids.softBlur})`}
      />
      <path d="M 111.4 56.2 L 112.4 278" fill="none" stroke="#6d5844" strokeWidth="0.7" opacity={rimLightOpacity} />
      <path d="M 112.6 289.3 L 114 488" fill="none" stroke="#6d5844" strokeWidth="0.7" opacity={rimLightOpacity} />
      <path
        d="M 115.4 498 C 116 530.8 119 558.1 126.5 581.2 C 129.3 589.6 130.1 595.9 129.9 601.4"
        fill="none"
        stroke="#6d5844"
        strokeWidth="0.8"
        opacity={rimLightOpacity}
      />
    </>
  );
};
