import { StickConfig, PointerEventType } from '../../types';
import { generateStick } from '../../utils/svgUtils';

interface GamepadStickProps {
  config: StickConfig;
  xValue: number;
  yValue: number;
  buttonValue: number;
  onInteraction: (idxX: number, idxY: number, e: React.PointerEvent, eventType: PointerEventType) => void;
}

export const GamepadStick: React.FC<GamepadStickProps> = ({ config, xValue, yValue, buttonValue, onInteraction }) => {
  const { axisX, axisY, x, y } = config;

  return generateStick(
    xValue,
    yValue,
    buttonValue,
    x,
    y,
    30,
    (e) => onInteraction(axisX, axisY, e, PointerEventType.Down),
    (e) => onInteraction(axisX, axisY, e, PointerEventType.Move),
    (e) => onInteraction(axisX, axisY, e, PointerEventType.Up)
  );
};