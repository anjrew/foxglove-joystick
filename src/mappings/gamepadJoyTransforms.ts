import { fromDate } from "@foxglove/rostime";

import { Header, Joy } from "../types";

type GameToJoyTransformFunction = (publishFrameId: string, gp: Gamepad) => Joy;

export type GamepadJoyTransformKey = "default" | "xbox" | "xbox_reverse";

function mapTrigger(
  value: number,
  input_min: number,
  input_max: number,
  output_min: number,
  output_max: number,
): number {
  // Ensure the input value is within the input range
  const clampedValue = Math.max(input_min, Math.min(input_max, value));

  // Calculate the input range and output range
  const inputRange = input_max - input_min;
  const outputRange = output_max - output_min;

  // Map the value from input range to output range
  const mappedVal = ((clampedValue - input_min) / inputRange) * outputRange + output_min;
  return mappedVal;
}

function reverseAllAxis(joy: Joy): Joy {
  joy.axes = joy.axes.map((axis) => -axis);
  return joy;
}

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
  const leftTriggerButtonIndex = 6;
  const rightTriggerButtonIndex = 7;

  const tmpJoy = {
    header: {
      frame_id: publishFrameId,
      stamp: fromDate(new Date()),
    } as Header,
    axes: gp.axes.map((axis) => -axis),
    buttons: gp.buttons.map((button) => button.value),
  } as Joy;

  // We have to do this hacky thing because the triggers are buttons on the xbox controller
  const leftTriggerButton = gp.buttons[leftTriggerButtonIndex];
  if (leftTriggerButton != undefined) {
    tmpJoy.axes.push(mapTrigger(leftTriggerButton.value, 0, 1, -1, 1));
  }
  const rightTriggerButton = gp.buttons[rightTriggerButtonIndex];
  if (rightTriggerButton != undefined) {
    tmpJoy.axes.push(mapTrigger(rightTriggerButton.value, 0, 1, -1, 1));
  }

  const xboxButtons = gp.buttons.map((button, index) => {
    if (index === leftTriggerButtonIndex || index === rightTriggerButtonIndex) {
      return mapTrigger(button.value, 0, 1, -1, 1);
    } else {
      return button.pressed ? 1 : 0;
    }
  });
  tmpJoy.buttons = xboxButtons;
  return reverseAllAxis(tmpJoy);
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
