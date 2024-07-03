import { fromDate } from "@foxglove/rostime";

import { Header, Joy } from "../types";

type GameToJoyTransformFunction = (publishFrameId: string, gp: Gamepad) => Joy;

export type GamepadJoyTransformKey = "default" | "xbox" | "xbox_reverse";

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

interface GamepadMappingEntry {
  label: string;
  transformFunction: GameToJoyTransformFunction;
}

type GamepadJoyTransforms = {
  [key: string]: GamepadMappingEntry;
};

const gamepadJoyMappings: GamepadJoyTransforms = {
  default: {
    label: "Default",
    transformFunction: defaultGameToJoyTransform,
  },
  xbox: {
    label: "Xbox",
    transformFunction: xboxPadToJoyTransform,
  },
  xbox_reverse: {
    label: "Xbox Reverse",
    transformFunction: xboxPadToJoyTransformReverse,
  },
};

export function transformGamepadToJoy(
  transformName: GamepadJoyTransformKey,
  publishFrameId: string,
  gp: Gamepad,
): Joy {
  return gamepadJoyMappings[transformName]!.transformFunction(publishFrameId, gp);
}

export function getGamepadJoyTransformOptions(): GamepadJoyTransforms {
  return gamepadJoyMappings;
}
