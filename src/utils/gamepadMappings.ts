import cheapo from "../mappings/cheapo.json";
import ipega9083s from "../mappings/ipega-9083s.json";
import steamdeck from "../mappings/steamdeck.json";
import xbox from "../mappings/xbox.json";
import { DisplayMapping } from "../types";

const gamepadMappings = {
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
  cheapo: {
    label: "Cheap Controller",
    getMapping: () => cheapo,
  },
} as const;

export type GamepadMappingKey = keyof typeof gamepadMappings;

export function getGamepadMapping(layoutName: GamepadMappingKey): DisplayMapping {
  return gamepadMappings[layoutName].getMapping();
}

export function getGamepadOptions(): { label: string; value: GamepadMappingKey }[] {
  return Object.entries(gamepadMappings).map(([key, { label }]) => ({
    label,
    value: key as GamepadMappingKey,
  }));
}
