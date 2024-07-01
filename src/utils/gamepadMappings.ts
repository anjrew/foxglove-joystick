import cheapo from "../mappings/cheapo.json";
import ipega9083s from "../mappings/ipega-9083s.json";
import steamdeck from "../mappings/steamdeck.json";
import xbox from "../mappings/xbox.json";
import { DisplayMapping } from "../types";

export function getGamepadMapping(layoutName: string): DisplayMapping {
  switch (layoutName) {
    case "steamdeck":
      return steamdeck;
    case "ipega-9083s":
      return ipega9083s;
    case "xbox":
      return xbox;
    case "cheapo":
      return cheapo;
    default:
      return [];
  }
}
