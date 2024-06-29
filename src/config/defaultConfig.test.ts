import { PanelExtensionContext } from "@foxglove/extension";

import { createDefaultConfig, createKeyboardMapping } from "./defaultConfig";

describe("createDefaultConfig", () => {
  it("creates default config with initial state", () => {
    const mockContext = {
      initialState: {
        subJoyTopic: "/custom_joy",
        publishMode: true,
      },
    } as unknown as PanelExtensionContext;

    const config = createDefaultConfig(mockContext);

    expect(config.subJoyTopic).toBe("/custom_joy");
    expect(config.publishMode).toBe(true);
    expect(config.pubJoyTopic).toBe("/joy");
    expect(config.dataSource).toBe("sub-joy-topic");
  });

  it("creates default config without initial state", () => {
    const mockContext = {
      initialState: {},
    } as unknown as PanelExtensionContext;

    const config = createDefaultConfig(mockContext);

    expect(config.subJoyTopic).toBe("/joy");
    expect(config.publishMode).toBe(false);
    expect(config.pubJoyTopic).toBe("/joy");
    expect(config.dataSource).toBe("sub-joy-topic");
  });
});

describe("createKeyboardMapping", () => {
  it("creates keyboard mapping with correct structure", () => {
    const mapping = createKeyboardMapping();

    expect(mapping.get("w")).toEqual({
      axis: 1,
      direction: 1,
      button: -1,
      value: 0,
    });

    expect(mapping.get("a")).toEqual({
      axis: 0,
      direction: 1,
      button: -1,
      value: 0,
    });

    expect(mapping.get(" ")).toEqual({
      button: 6,
      axis: -1,
      direction: 0,
      value: 0,
    });
  });
});
