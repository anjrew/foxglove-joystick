import { fromDate } from "@foxglove/rostime";

import { Header, Joy } from "../types";

type GameToJoyTransformFunction = (publishFrameId: string, gp: Gamepad) => Joy;

export type GamepadJoyTransformKey = "Default" | "Xbox" | "Xbox Reverse";

const defaultGameToJoyTransform = (publishFrameId: string, gp: Gamepad): Joy => {
  return {
    header: {
      frame_id: publishFrameId,
      stamp: fromDate(new Date()),
    } as Header,
    axes: gp.axes.map((axis) => -axis),
    buttons: gp.buttons.map((button) => (button.pressed ? 1 : 0)),
  } as Joy;
};

function xboxPadToJoyTransform(publishFrameId: string, gp: Gamepad): Joy {
  const tmpJoy = defaultGameToJoyTransform(publishFrameId, gp);
  const triggerLeftAxis: number = gp.buttons[6]?.value ?? 0;
  const triggerRightAxis: number = gp.buttons[7]?.value ?? 0;
  tmpJoy.axes = [...tmpJoy.axes, triggerLeftAxis, triggerRightAxis];

  const xboxButtons = gp.buttons.map((button, index) => {
    if (index === 6 || index === 7) {
      return button.value;
    } else {
      return button.pressed ? 1 : 0;
    }
  });
  tmpJoy.buttons = xboxButtons;
  return tmpJoy;
}

function xboxPadToJoyTransformReverse(publishFrameId: string, gp: Gamepad): Joy {
  const tmpJoy = defaultGameToJoyTransform(publishFrameId, gp);
  const triggerLeftAxis: number = gp.buttons[6]?.value ?? 0;
  const triggerRightAxis: number = gp.buttons[7]?.value ?? 0;
  tmpJoy.axes = [...tmpJoy.axes, triggerLeftAxis, triggerRightAxis];

  const xboxButtons = gp.buttons.map((button, index) => {
    if (index === 6 || index === 7) {
      return button.value;
    } else {
      return button.pressed ? 1 : 0;
    }
  });
  tmpJoy.axes = tmpJoy.axes.map((axis) => -axis);
  tmpJoy.buttons = xboxButtons;
  return tmpJoy;
}

const gamepadJoyMappings: { [label: string]: GameToJoyTransformFunction } = {
  Default: defaultGameToJoyTransform,
  Xbox: xboxPadToJoyTransform,
  "Xbox Reverse": xboxPadToJoyTransformReverse,
};

export function transformGamepadToJoy(
  transformName: GamepadJoyTransformKey,
  publishFrameId: string,
  gp: Gamepad,
): Joy {
  return gamepadJoyMappings[transformName]!(publishFrameId, gp);
}

export function getGamepadJoyTransformOptions(): Array<GamepadJoyTransformKey> {
  return Object.keys(gamepadJoyMappings) as Array<GamepadJoyTransformKey>;
}
