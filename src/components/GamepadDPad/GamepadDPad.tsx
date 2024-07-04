import { GamepadComponentConfig } from "../../types";
import { generateDPad } from "../../utils/svgUtils";

interface GamepadDPadProps {
  config: GamepadComponentConfig;
  xValue: number;
  yValue: number;
}

export const GamepadDPad: React.FC<GamepadDPadProps> = ({ config, xValue, yValue }) => {
  const { x, y } = config;

  return generateDPad(xValue, yValue, x, y, 30);
};
