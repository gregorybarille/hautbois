import { ChartTheme } from "./chartTheme";

interface KeyLegendProps {
  theme: ChartTheme;
  // When provided, adds the half-hole swatch (oboe only).
  halfGradientId?: string;
  transform?: string;
}

// "Ouvert / Fermé / ½" legend shared by the wind fingering charts.
export const KeyLegend = ({
  theme,
  halfGradientId,
  transform,
}: KeyLegendProps) => (
  <g transform={transform}>
    <rect
      x={-10}
      y={-15}
      width={halfGradientId ? 160 : 110}
      height={35}
      rx={8}
      fill={theme.legendBg}
      stroke={theme.legendBorder}
      strokeWidth="1"
    />

    <circle
      cx={8}
      cy={0}
      r={7}
      fill={theme.keyWhite}
      stroke={theme.keyBorder}
      strokeWidth="1"
    />
    <text x={20} y={4} fontSize={9} fill={theme.text} fontFamily="system-ui">
      Ouvert
    </text>

    <circle
      cx={70}
      cy={0}
      r={7}
      fill={theme.pressed}
      stroke={theme.keyBorder}
      strokeWidth="1"
    />
    <text x={82} y={4} fontSize={9} fill={theme.text} fontFamily="system-ui">
      Fermé
    </text>

    {halfGradientId && (
      <>
        <circle
          cx={130}
          cy={0}
          r={7}
          fill={`url(#${halfGradientId})`}
          stroke={theme.keyBorder}
          strokeWidth="1"
        />
        <text
          x={142}
          y={4}
          fontSize={9}
          fill={theme.text}
          fontFamily="system-ui"
        >
          ½
        </text>
      </>
    )}
  </g>
);
