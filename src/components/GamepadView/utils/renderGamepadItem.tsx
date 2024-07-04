import { renderBar } from "./renderBar";
import { renderButton } from "./renderButton";
import { renderDPad } from "./renderDPad";
import { renderStick } from "./renderStick";
import {
  ButtonConfig,
  GamepadComponentConfig,
  ButtonInteractionHandler,
  Joy,
  StickConfig,
  AxisInteractionHandler,
  BarConfig,
} from "../../../types";

const itemRenderers: {
  [key: string]: (
    item: GamepadComponentConfig,
    joyTransformed: Joy,
    handleButtonInteraction: ButtonInteractionHandler,
    handleAxisInteraction: AxisInteractionHandler,
  ) => JSX.Element | null;
} = {
  button: (cfg, j, handleButton) => renderButton(cfg as ButtonConfig, j, handleButton),
  stick: (cfg, j, _, handleAxis) => renderStick(cfg as StickConfig, j, handleAxis),
  "d-pad": (cfg, j) => renderDPad(cfg, j),
  bar: (cfg, j) => renderBar(cfg as BarConfig, j),
};

export function renderGamepadItem(
  item: GamepadComponentConfig,
  joy: Joy,
  handleButtonInteraction: ButtonInteractionHandler,
  handleAxisInteraction: AxisInteractionHandler,
): JSX.Element | null {
  const renderer = itemRenderers[item.type];
  if (renderer) {
    return renderer(item, joy, handleButtonInteraction, handleAxisInteraction);
  }
  console.error("Unknown mapping item type:", item);
  return null;
}
