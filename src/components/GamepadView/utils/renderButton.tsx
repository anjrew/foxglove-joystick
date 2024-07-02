import React from "react";

import { ButtonConfig, Joy, PointerEventType } from "../../../types";
import { GamepadButton } from "../../GamepadButton";

export const renderButton = (
  item: ButtonConfig,
  joyTransformed: Joy,
  handleButtonInteraction: (
    idx: number,
    e: React.PointerEvent,
    eventType: PointerEventType,
  ) => void,
): JSX.Element => (
  <GamepadButton
    config={item}
    value={joyTransformed.buttons[item.button] ?? 0}
    onInteraction={handleButtonInteraction}
  />
);
