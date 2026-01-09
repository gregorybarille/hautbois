import { OboeKeys } from "../../constants/oboeFingerings";

interface OboeFingeringChartProps {
  keys?: Partial<OboeKeys>;
  className?: string;
  height?: number;
}

type KeyStatus = boolean | "open" | "closed" | "half";

interface KeyProps {
  x: number;
  y: number;
  r?: number;
  status: KeyStatus;
  label?: string;
  labelPos?: "left" | "right" | "top" | "bottom";
  connectorTo?: { x: number; y: number };
}

const Key = ({
  x,
  y,
  r = 12,
  status,
  label,
  labelPos = "right",
  connectorTo,
}: KeyProps) => {
  const isPressed = status === true || status === "closed";
  const isHalf = status === "half";

  const fillColor = isPressed ? "#EF4444" : "white"; // red-500
  const strokeColor = "#374151"; // gray-700

  return (
    <g>
      {connectorTo && (
        <line
          x1={x}
          y1={y}
          x2={connectorTo.x}
          y2={connectorTo.y}
          stroke={strokeColor}
          strokeWidth="2"
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={isHalf ? "white" : fillColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
      {isHalf && (
        <path
          d={`M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x} ${y + r} Z`}
          fill="#EF4444"
          stroke="none"
        />
      )}
      {label && (
        <text
          x={
            labelPos === "left"
              ? x - r - 8
              : labelPos === "right"
                ? x + r + 8
                : x
          }
          y={
            labelPos === "top"
              ? y - r - 8
              : labelPos === "bottom"
                ? y + r + 15
                : y + 4
          }
          textAnchor={
            labelPos === "left"
              ? "end"
              : labelPos === "right"
                ? "start"
                : "middle"
          }
          className="text-xs font-semibold fill-gray-600 select-none"
        >
          {label}
        </text>
      )}
    </g>
  );
};

const Separator = ({ y }: { y: number }) => (
  <line
    x1="80"
    y1={y}
    x2="220"
    y2={y}
    stroke="#E5E7EB"
    strokeWidth="2"
    strokeDasharray="4"
  />
);

export const OboeFingeringChart = ({
  keys = {},
  className = "",
  height = 500,
}: OboeFingeringChartProps) => {
  // ViewBox: 0 0 300 600
  // Center X axis: 150

  return (
    <svg
      viewBox="0 0 300 650"
      className={className}
      style={{ height: height, width: "auto", maxHeight: "100%" }}
    >
      {/* Instrument Body Line (Abstract) */}
      <line
        x1="150"
        y1="50"
        x2="150"
        y2="600"
        stroke="#E5E7EB"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* --- LEFT HAND (Upper Joint) --- */}

      {/* Octave Keys (Left side breakout) */}
      <g transform="translate(-20, 0)">
        <text
          x="60"
          y="40"
          className="text-xs fill-gray-500 font-bold"
          textAnchor="end"
        >
          Pouce G
        </text>
        <Key
          x={60}
          y={60}
          status={keys.octave1 ?? false}
          label="1"
          labelPos="left"
        />
        <Key
          x={80}
          y={80}
          r={8}
          status={keys.octave2 ?? false}
          label="2"
          labelPos="bottom"
          connectorTo={{ x: 60, y: 60 }}
        />
        <Key
          x={40}
          y={80}
          r={8}
          status={keys.octave3 ?? false}
          label="3"
          labelPos="bottom"
          connectorTo={{ x: 60, y: 60 }}
        />
      </g>

      {/* Main Stack LH */}
      <Key
        x={150}
        y={100}
        status={keys.l1 ?? "open"}
        label="L1"
        labelPos="left"
      />
      <Key
        x={150}
        y={150}
        status={keys.l2 ?? false}
        label="L2"
        labelPos="left"
      />
      <Key
        x={150}
        y={200}
        status={keys.l3 ?? false}
        label="L3"
        labelPos="left"
      />

      {/* LH Pinky / Side Keys */}
      <Key
        x={200}
        y={210}
        status={keys.gSharp ?? false}
        label="Sol#"
        labelPos="right"
        connectorTo={{ x: 150, y: 200 }}
      />

      {/* Additional Side Keys (Simplified placement) */}
      <Key
        x={190}
        y={120}
        r={8}
        status={keys.leftEb ?? false}
        label="Mi♭"
        labelPos="right"
      />
      <Key
        x={110}
        y={220}
        r={8}
        status={keys.leftF ?? false}
        label="Fa"
        labelPos="left"
      />

      <Separator y={260} />

      {/* --- RIGHT HAND (Lower Joint) --- */}

      {/* Main Stack RH */}
      <Key
        x={150}
        y={300}
        status={keys.r1 ?? false}
        label="R1"
        labelPos="left"
      />
      <Key
        x={150}
        y={350}
        status={keys.r2 ?? false}
        label="R2"
        labelPos="left"
      />
      <Key
        x={150}
        y={400}
        status={keys.r3 ?? false}
        label="R3"
        labelPos="left"
      />

      {/* Banana Key */}
      <Key
        x={180}
        y={390}
        r={8}
        status={keys.banana ?? false}
        label="Banane"
        labelPos="right"
        connectorTo={{ x: 150, y: 400 }}
      />

      {/* RH Pinky Cluster */}
      <g transform="translate(0, 30)">
        <Key
          x={190}
          y={450}
          status={keys.c ?? false}
          label="Do"
          labelPos="right"
          connectorTo={{ x: 150, y: 400 }}
        />
        <Key
          x={200}
          y={480}
          status={keys.cSharp ?? false}
          label="Do#"
          labelPos="right"
          connectorTo={{ x: 150, y: 400 }}
        />
        <Key
          x={180}
          y={510}
          status={keys.rightEb ?? false}
          label="Mi♭"
          labelPos="right"
          connectorTo={{ x: 150, y: 400 }}
        />
      </g>

      {/* Bell Keys (Operated by LH pinky usually, but visually often at bottom) */}
      <g transform="translate(0, 30)">
        <Key
          x={110}
          y={480}
          status={keys.lowB ?? false}
          label="Si Gr."
          labelPos="left"
          connectorTo={{ x: 150, y: 400 }}
        />
        <Key
          x={120}
          y={510}
          status={keys.lowBb ?? false}
          label="Si♭ Gr."
          labelPos="left"
          connectorTo={{ x: 150, y: 400 }}
        />
      </g>

      {/* Legend */}
      <g transform="translate(20, 600)">
        <circle
          cx="0"
          cy="0"
          r="6"
          fill="white"
          stroke="#374151"
          strokeWidth="2"
        />
        <text x="15" y="4" className="text-xs fill-gray-500">
          Ouvert
        </text>

        <circle
          cx="60"
          cy="0"
          r="6"
          fill="#EF4444"
          stroke="#374151"
          strokeWidth="2"
        />
        <text x="75" y="4" className="text-xs fill-gray-500">
          Fermé
        </text>

        <g transform="translate(130, 0)">
          <circle
            cx="0"
            cy="0"
            r="6"
            fill="white"
            stroke="#374151"
            strokeWidth="2"
          />
          <path d="M 0 -6 A 6 6 0 0 0 0 6 Z" fill="#EF4444" />
          <text x="15" y="4" className="text-xs fill-gray-500">
            Demi-trou
          </text>
        </g>
      </g>
    </svg>
  );
};
