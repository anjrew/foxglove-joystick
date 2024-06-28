import {
  Topic,
  SettingsTreeAction,
  SettingsTreeFields,
  SettingsTreeNodes,
} from "@foxglove/extension";
import { produce } from "immer";
import * as _ from "lodash";

export type Config = {
  dataSource: string;
  subJoyTopic: string;
  gamepadId: number;
  publishMode: boolean;
  pubJoyTopic: string;
  publishFrameId: string;
  displayMode: string;
  debugGamepad: boolean;
  layoutName: string;
  mapping_name: string;
  options: Options;
};

export type Options = {
  availableControllers: Gamepad[];
};

export function settingsActionReducer(prevConfig: Config, action: SettingsTreeAction): Config {
  return produce(prevConfig, (draft) => {
    if (action.action === "update") {
      const { path, value } = action.payload;
      _.set(draft, path.slice(1), value);
    }
  });
}

export function buildSettingsTree(config: Config, topics?: readonly Topic[]): SettingsTreeNodes {
  const options: Options = config.options;

  const dataSourceFields: SettingsTreeFields = {
    dataSource: {
      label: "Data Source",
      input: "select",
      value: config.dataSource,
      options: [
        {
          label: "Subscribed Joy Topic",
          value: "sub-joy-topic",
        },
        {
          label: "Gamepad",
          value: "gamepad",
        },
        {
          label: "Interactive",
          value: "interactive",
        },
        {
          label: "Keyboard",
          value: "keyboard",
        },
      ],
    },
    subJoyTopic: {
      label: "Subscribe. Joy Topic",
      input: "select",
      value: config.subJoyTopic,
      disabled: config.dataSource !== "sub-joy-topic",
      options: (topics ?? [])
        .filter((topic) => topic.datatype === "sensor_msgs/msg/Joy")
        .map((topic) => ({
          label: topic.name,
          value: topic.name,
        })),
      // error: (!config.topic ? "Topic name is empty" : null),
    },
    gamepadId: {
      label: "Gamepad ID",
      input: "select",
      value: config.gamepadId.toString(),
      disabled: config.dataSource !== "gamepad",
      options: options.availableControllers.map((gp: Gamepad) => ({
        label: gp.id,
        value: gp.index.toString(),
      })),
    },
    gamepadMapping: {
      label: "GP->Joy Mapping",
      input: "select",
      value: "default",
      disabled: config.dataSource !== "gamepad",
      options: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "TODO Make selectable",
          value: "todo",
        },
      ],
    },
  };
  const publishFields: SettingsTreeFields = {
    publishMode: {
      label: "Publish Mode",
      input: "boolean",
      value: config.publishMode,
      disabled: config.dataSource === "sub-joy-topic",
    },
    pubJoyTopic: {
      label: "Pub Joy Topic",
      input: "string",
      value: config.pubJoyTopic,
    },
    publishFrameId: {
      label: "Joy Frame ID",
      input: "string",
      value: config.publishFrameId,
    },
  };
  const displayFields: SettingsTreeFields = {
    displayMode: {
      label: "Display Mode",
      input: "select",
      value: config.displayMode,
      options: [
        {
          label: "Auto-Generated",
          value: "auto",
        },
        {
          label: "Custom Display",
          value: "custom",
        },
      ],
    },
    layoutName: {
      label: "Layout",
      input: "select",
      disabled: config.displayMode === "auto",
      value: config.layoutName,
      options: [
        {
          label: "Steam Deck",
          value: "steamdeck",
        },
        {
          label: "iPega PG-9083s",
          value: "ipega-9083s",
        },
        {
          label: "Xbox",
          value: "xbox",
        },
        {
          label: "Cheap Controller",
          value: "cheapo",
        },
      ],
    },

    // mapping: {
    //   label: "Mapping",
    //   input: "select",
    //   value: config.mapping_name,
    //   disabled: true, // config.displayMode === "auto",
    //   options: [
    //     {
    //       label: "Custom",
    //       value: "custom",
    //     },
    //   ],
    // },
    debugGamepad: {
      label: "Debug Gamepad",
      input: "boolean",
      value: config.debugGamepad,
    },
  };

  const settings: SettingsTreeNodes = {
    dataSource: {
      label: "Data Source",
      fields: dataSourceFields,
    },
    publish: {
      label: "Publish",
      fields: publishFields,
    },
    display: {
      label: "Display",
      fields: displayFields,
    },
  };

  return settings;
}
