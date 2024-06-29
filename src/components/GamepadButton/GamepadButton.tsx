import { ButtonConfig, PointerEventType } from '../../types';
import { generateButton } from '../../utils/svgUtils';

interface GamepadButtonProps {
  config: ButtonConfig;
  value: number;
  onInteraction: (idx: number, e: React.PointerEvent, eventType: PointerEventType) => void;
}

export const GamepadButton: React.FC<GamepadButtonProps> = ({ config, value, onInteraction }) => {
  const { button, text, x, y } = config;
  const radius = 18;

  return generateButton(
    value,
    x,
    y,
    text,
    radius,
    (e) => onInteraction(button, e, PointerEventType.Down),
    (e) => onInteraction(button, e, PointerEventType.Up)
  );
};