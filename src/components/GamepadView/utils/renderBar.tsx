import { AxisBarConfig, AnalogButtonBarConfig, Joy } from "../../../types";
import { GamepadBar } from "../../GamepadBar";

export const renderBar = (
  item: AxisBarConfig | AnalogButtonBarConfig,
  joyTransformed: Joy,
): JSX.Element | null => {
  if ("axis" in item) {
    return <GamepadBar config={item} value={joyTransformed.axes[item.axis] ?? 0} />;
  }
  if ("button" in item) {
    return <GamepadBar config={item} value={joyTransformed.buttons[item.button] ?? 0} />;
  }
  console.error("Invalid bar config:", item);
  return null;
};
