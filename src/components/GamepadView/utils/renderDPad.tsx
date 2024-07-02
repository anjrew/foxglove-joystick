import React from "react";

import { GamepadComponentConfig, isDPadAxisConfig, isDPadButtonConfig, Joy } from "../../../types";
import { GamepadDPad } from "../../GamepadDPad";

export const renderDPad = (item: GamepadComponentConfig, joyTransformed: Joy): JSX.Element => {
  if (isDPadAxisConfig(item)) {
    return (
      <GamepadDPad
        config={item}
        xValue={joyTransformed.axes[item.axisX] ?? 0}
        yValue={joyTransformed.axes[item.axisY] ?? 0}
      />
    );
  }
  if (isDPadButtonConfig(item)) {
    let xValue = 0;
    let yValue = 0;
    if (joyTransformed.buttons[item.right] === 1) {
      xValue = 1;
    } else if (joyTransformed.buttons[item.left] === 1) {
      xValue = -1;
    }
    if (joyTransformed.buttons[item.down] === 1) {
      yValue = 1;
    } else if (joyTransformed.buttons[item.up] === 1) {
      yValue = -1;
    }
    return <GamepadDPad config={item} xValue={xValue} yValue={yValue} />;
  }
  throw new Error(`Invalid d-pad config: ${JSON.stringify(item)}`);
};
