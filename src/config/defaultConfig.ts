import { PanelExtensionContext } from "@foxglove/extension";

import { PanelConfig } from "./types";
import { kbmapping1 } from "../mappings";
import { KbMap } from "../types";

export const createDefaultConfig = (context?: PanelExtensionContext): PanelConfig => {
  const partialConfig = (context?.initialState ?? {}) as Partial<PanelConfig>;

  return {
    subJoyTopic: partialConfig.subJoyTopic ?? "/joy",
    pubJoyTopic: partialConfig.pubJoyTopic ?? "/joy",
    publishMode: partialConfig.publishMode ?? false,
    publishFrameId: partialConfig.publishFrameId ?? "",
    dataSource: partialConfig.dataSource ?? "sub-joy-topic",
    displayMode: partialConfig.displayMode ?? "auto",
    debugGamepad: partialConfig.debugGamepad ?? false,
    layoutName: partialConfig.layoutName ?? "steamdeck",
    gamepadJoyTransform: partialConfig.gamepadJoyTransform ?? "Default",
    gamepadId: partialConfig.gamepadId ?? 0,
    options: {
      availableControllers: [],
    },
  } as PanelConfig;
};

export const createKeyboardMapping = (): Map<string, KbMap> => {
  const keyMap = new Map<string, KbMap>();

  for (const [key, value] of Object.entries(kbmapping1)) {
    const k: KbMap = {
      button: value.button,
      axis: value.axis,
      direction: value.direction === "+" ? 1 : 0,
      value: 0,
    };
    keyMap.set(key, k);
  }
  return keyMap;
};
