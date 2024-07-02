import { DisplayMapping, Joy } from "../../../types";
import { GamepadMappingKey, getGamepadMapping, transformJoy } from "../../../utils/gamepadMappings";

export const useGamepadData = (
  joy: Joy | undefined,
  layoutName: GamepadMappingKey,
): { displayMapping: DisplayMapping; joyTransformed: Joy | undefined } => {
  const displayMapping = getGamepadMapping(layoutName);
  const joyTransformed: Joy | undefined = joy ? transformJoy(layoutName, joy) : undefined;

  return { displayMapping, joyTransformed };
};
