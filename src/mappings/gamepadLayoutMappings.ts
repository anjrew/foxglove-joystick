import cheapo from "./cheapo.json";
import ipega9083s from "./ipega-9083s.json";
import steamdeck from "./steamdeck.json";
import xbox from "./xbox.json";
import { DisplayMapping } from "../types";

// Define types for the mapping functions
type GetLayoutMappingFunction = () => DisplayMapping;

// Define an interface for each gamepad mapping entry
interface GamepadMappingEntry {
  label: string;
  getMapping: GetLayoutMappingFunction;
}

export type GamepadLayoutMappingKey = "steamdeck" | "ipega-9083s" | "xbox" | "xbox2" | "cheapo";

// Define the type for the entire gamepadMappings object
type GamepadMappings = {
  [key: string]: GamepadMappingEntry;
};

const gamepadLayoutMappings: GamepadMappings = {
  steamdeck: {
    label: "Steam Deck",
    getMapping: () => steamdeck,
  },
  "ipega-9083s": {
    label: "iPega PG-9083s",
    getMapping: () => ipega9083s,
  },
  xbox: {
    label: "Xbox",
    getMapping: () => xbox,
  },
  xbox2: {
    label: "Xbox Axis Reverse",
    getMapping: () => xbox,
  },
  cheapo: {
    label: "Cheap Controller",
    getMapping: () => cheapo,
  },
};

export function getGamepadLayoutMapping(layoutName: GamepadLayoutMappingKey): DisplayMapping {
  return gamepadLayoutMappings[layoutName]!.getMapping();
}

export function getGamepadOptions(): { label: string; value: GamepadLayoutMappingKey }[] {
  return Object.entries(gamepadLayoutMappings).map(([key, { label }]) => ({
    label,
    value: key as GamepadLayoutMappingKey,
  }));
}
