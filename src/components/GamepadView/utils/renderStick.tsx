import { StickConfig, Joy, AxisInteractionHandler } from "../../../types";
import { GamepadStick } from "../../GamepadStick";

export const renderStick = (
  item: StickConfig,
  joyTransformed: Joy,
  handleAxisInteraction: AxisInteractionHandler,
): JSX.Element => (
  <GamepadStick
    config={item}
    xValue={joyTransformed.axes[item.axisX] ?? 0}
    yValue={joyTransformed.axes[item.axisY] ?? 0}
    buttonValue={joyTransformed.buttons[item.button] ?? 0}
    onInteraction={handleAxisInteraction}
  />
);
