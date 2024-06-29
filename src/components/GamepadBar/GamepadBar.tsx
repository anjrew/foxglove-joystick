import { BarConfig } from '../../types';

interface GamepadBarProps {
  config: BarConfig;
  value: number;
}

export const GamepadBar: React.FC<GamepadBarProps> = ({ config, value }) => {
  const { x, y, rot, axis } = config;
  const width = 60;
  const height = 20;
  const filledWidth = (value + 1) * width / 2; // Convert -1 to 1 range to 0 to width

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <rect 
        x={-width / 2} 
        y={-height / 2} 
        width={width} 
        height={height} 
        fill="lightgray" 
        stroke="black" 
        strokeWidth="2"
      />
      <rect 
        x={-width / 2} 
        y={-height / 2} 
        width={filledWidth} 
        height={height} 
        fill="blue"
      />
      <text 
        x={0} 
        y={0} 
        textAnchor="middle" 
        dominantBaseline="central" 
        fill="white"
        fontSize="12"
      >
        {axis}
      </text>
    </g>
  );
};