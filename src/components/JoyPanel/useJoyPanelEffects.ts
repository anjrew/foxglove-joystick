import { useEffect } from 'react';
import { buildSettingsTree, settingsActionReducer } from "../../config/panelSettings";
import { Joy, KbMap } from "../../types";
import { PanelExtensionContext, SettingsTreeAction } from "@foxglove/extension";
import { useJoyPanelState } from './useJoyPanelState';
import { useJoyPanelCallbacks } from './joyPanelCallbacks';

export type JoyPanelEffectsProps = {
  context: PanelExtensionContext;
  config: ReturnType<typeof useJoyPanelState>['config'];
  setConfig: ReturnType<typeof useJoyPanelState>['setConfig'];
  joy: Joy | undefined;
  setJoy: (joy: Joy | undefined) => void;
  pubTopic: string | undefined;
  setPubTopic: (topic: string | undefined) => void;
  kbEnabled: boolean;
  trackedKeys: Map<string, KbMap> | undefined;
  messages: ReturnType<typeof useJoyPanelState>['messages'];
  callbacks: ReturnType<typeof useJoyPanelCallbacks>;
};

export function useJoyPanelEffects({
  context,
  config,
  setConfig,
  joy,
  setJoy,
  pubTopic,
  setPubTopic,
  kbEnabled,
  trackedKeys,
  messages,
  callbacks,
}: JoyPanelEffectsProps) {
  // Register the settings tree
  useEffect(() => {
    context.updatePanelSettingsEditor({
      actionHandler: (action: SettingsTreeAction) => {
        setConfig((prevConfig) => settingsActionReducer(prevConfig, action));
      },
      nodes: buildSettingsTree(config),
    });
  }, [context, config, setConfig]);

  // Subscribe to the relevant topic when in a recorded session
  useEffect(() => {
    if (config.dataSource === "sub-joy-topic") {
      context.subscribe([{ topic: config.subJoyTopic }]);
    } else {
      context.unsubscribeAll();
    }
  }, [config.subJoyTopic, context, config.dataSource]);

  // Update Joy state when new messages are received
  useEffect(() => {
    const latestJoy = messages?.[messages.length - 1]?.message as Joy | undefined;
    if (latestJoy) {
      console.log("Joy message received, updating...", latestJoy);
      const tmpMsg = {
        header: {
          stamp: latestJoy.header.stamp,
          frame_id: config.publishFrameId,
        },
        axes: Array.from(latestJoy.axes),
        buttons: Array.from(latestJoy.buttons),
      };
      setJoy(tmpMsg);
    }
  }, [messages, config.publishFrameId, setJoy]);

  // Keyboard event listeners
    useEffect(() => {
      if (config.dataSource === "keyboard" && kbEnabled) {
        document.addEventListener("keydown", callbacks.handleKeyDown);
        document.addEventListener("keyup", callbacks.handleKeyUp);
        return () => {
          document.removeEventListener("keydown", callbacks.handleKeyDown);
          document.removeEventListener("keyup", callbacks.handleKeyUp);
        };
      }
      return () => {};
    }, [config.dataSource, kbEnabled, callbacks.handleKeyDown, callbacks.handleKeyUp]);

  // Generate Joy from Keys
  useEffect(() => {
    if (config.dataSource !== "keyboard" || !kbEnabled) {
      return;
    }

    const axes: number[] = [];
    const buttons: number[] = [];

    trackedKeys?.forEach((value) => {
      if (value.button >= 0) {
        while (buttons.length <= value.button) {
          buttons.push(0);
        }
        buttons[value.button] = value.value;
      } else if (value.axis >= 0) {
        while (axes.length <= value.axis) {
          axes.push(0);
        }
        axes[value.axis] += (value.direction > 0 ? 1 : -1) * value.value;
      }
    });

    setJoy({
      header: {
        frame_id: config.publishFrameId,
        stamp: { sec: 0, nsec: 0 }, // You might want to use a proper timestamp here
      },
      axes,
      buttons,
    });
  }, [config.dataSource, config.publishFrameId, kbEnabled, trackedKeys, setJoy]);

  // Advertise the topic to publish
  useEffect(() => {
    if (config.publishMode) {
      setPubTopic(config.pubJoyTopic);
      context.advertise?.(config.pubJoyTopic, "sensor_msgs/Joy");
    } else if (pubTopic) {
      context.unadvertise?.(pubTopic);
      setPubTopic(undefined);
    }
  }, [config.pubJoyTopic, config.publishMode, context, pubTopic, setPubTopic]);

  // Publish the joy message
  useEffect(() => {
    if (config.publishMode && pubTopic && pubTopic === config.pubJoyTopic && joy) {
      context.publish?.(pubTopic, joy);
    }
  }, [context, config.pubJoyTopic, config.publishMode, joy, pubTopic]);

  // Save state
  useEffect(() => {
    context.saveState(config);
  }, [context, config]);
}