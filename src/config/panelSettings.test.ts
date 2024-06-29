import { settingsActionReducer, buildSettingsTree } from "./panelSettings";
import { Config } from "./types";

describe("settingsActionReducer", () => {
  it("updates config with new values", () => {
    const initialConfig: Config = {
      dataSource: "gamepad",
      subJoyTopic: "/joy",
      gamepadId: 0,
      publishMode: false,
      pubJoyTopic: "/joy",
      publishFrameId: "",
      displayMode: "auto",
      debugGamepad: false,
      layoutName: "steamdeck",
      mapping_name: "TODO",
      options: { availableControllers: [] },
    };

    const newConfig = settingsActionReducer(initialConfig, {
      action: "update",
      payload: { path: ["dataSource"], value: "gamepad", input: "autocomplete" },
    });

    expect(newConfig.dataSource).toBe("gamepad");
  });
});

describe("buildSettingsTree", () => {
  it("builds settings tree with correct structure", () => {
    const config: Config = {
      dataSource: "sub-joy-topic",
      subJoyTopic: "/joy",
      gamepadId: 0,
      publishMode: false,
      pubJoyTopic: "/joy",
      publishFrameId: "",
      displayMode: "auto",
      debugGamepad: false,
      layoutName: "steamdeck",
      mapping_name: "TODO",
      options: { availableControllers: [] },
    };

    const tree = buildSettingsTree(config);

    expect(tree.dataSource).toBeDefined();
    expect(tree.publish).toBeDefined();
    expect(tree.display).toBeDefined();

    expect(tree.dataSource?.fields?.dataSource?.value).toBe("sub-joy-topic");
    expect(tree.publish?.fields?.publishMode?.value).toBe(false);
    expect(tree.display?.fields?.displayMode?.value).toBe("auto");
  });
});
