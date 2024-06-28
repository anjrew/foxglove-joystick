import { PanelExtensionContext } from "@foxglove/extension";

import kbmapping1 from "./components/kbmapping1.json";
import { Config } from "./panelSettings";
import { KbMap } from "./types";

export const createDefaultConfig = (context: PanelExtensionContext): Config => {
  const partialConfig = context.initialState as Partial<Config>;

  return {
    subJoyTopic: partialConfig.subJoyTopic ?? "/joy",
    pubJoyTopic: partialConfig.pubJoyTopic ?? "/joy",
    publishMode: partialConfig.publishMode ?? false,
    publishFrameId: partialConfig.publishFrameId ?? "",
    dataSource: partialConfig.dataSource ?? "sub-joy-topic",
    displayMode: partialConfig.displayMode ?? "auto",
    debugGamepad: partialConfig.debugGamepad ?? false,
    layoutName: partialConfig.layoutName ?? "steamdeck",
    mapping_name: partialConfig.mapping_name ?? "TODO",
    gamepadId: partialConfig.gamepadId ?? 0,
    options: {
      availableControllers: [],
    },
  };
};

export const createKeyboardMapping = (): Map<string, KbMap> => {
  {
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
  }
};
