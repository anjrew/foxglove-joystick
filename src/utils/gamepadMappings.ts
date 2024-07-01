import { fromDate } from "@foxglove/rostime";
import _ from "lodash";

import cheapo from "../mappings/cheapo.json";
import ipega9083s from "../mappings/ipega-9083s.json";
import steamdeck from "../mappings/steamdeck.json";
import xbox from "../mappings/xbox.json";
import { DisplayMapping, Header, Joy } from "../types";

// Define types for the mapping functions
type GetMappingFunction = () => DisplayMapping;
type JoyTransformFunction = (joy: Joy) => Joy;
type GameToJoyTransformFunction = (publishFrameId: string, gp: Gamepad) => Joy;

// Define an interface for each gamepad mapping entry
interface GamepadMappingEntry {
  label: string;
  getMapping: GetMappingFunction;
  getJoyTransform: JoyTransformFunction;
  getGameToJoyTransform: GameToJoyTransformFunction;
}

export type GamepadMappingKey = "steamdeck" | "ipega-9083s" | "xbox" | "xbox2" | "cheapo";

// Define the type for the entire gamepadMappings object
type GamepadMappings = {
  [key: string]: GamepadMappingEntry;
};

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

const gamepadMappings: GamepadMappings = {
  steamdeck: {
    label: "Steam Deck",
    getMapping: () => steamdeck,
    getJoyTransform: (joy: Joy) => joy,
    getGameToJoyTransform: defaultGameToJoyTransform,
  },
  "ipega-9083s": {
    label: "iPega PG-9083s",
    getMapping: () => ipega9083s,
    getJoyTransform: (joy: Joy) => joy,
    getGameToJoyTransform: defaultGameToJoyTransform,
  },
  xbox: {
    label: "Xbox",
    getMapping: () => xbox,
    getJoyTransform: (joy: Joy) => joy,
    getGameToJoyTransform: xboxPadToJoyTransform,
  },
  xbox2: {
    label: "Xbox Axis Reverse",
    getMapping: () => xbox,
    getJoyTransform: (joy: Joy) => {
      joy.axes = joy.axes.map((axis) => -axis);
      return joy;
    },
    getGameToJoyTransform: xboxPadToJoyTransform,
  },
  cheapo: {
    label: "Cheap Controller",
    getMapping: () => cheapo,
    getJoyTransform: (joy: Joy) => joy,
    getGameToJoyTransform: defaultGameToJoyTransform,
  },
} as const;

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

export function getGamepadMapping(layoutName: GamepadMappingKey): DisplayMapping {
  return gamepadMappings[layoutName]!.getMapping();
}

export function transformJoy(layoutName: GamepadMappingKey, joy: Joy): Joy {
  return gamepadMappings[layoutName]!.getJoyTransform(joy);
}

export function getGamepadOptions(): { label: string; value: GamepadMappingKey }[] {
  return Object.entries(gamepadMappings).map(([key, { label }]) => ({
    label,
    value: key as GamepadMappingKey,
  }));
}

export function getGameToJoyTransform(
  publishFrameId: string,
  layoutName: GamepadMappingKey,
  gp: Gamepad,
): Joy {
  return gamepadMappings[layoutName]!.getGameToJoyTransform(publishFrameId, gp);
}
