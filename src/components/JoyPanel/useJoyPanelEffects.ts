import { useState, useCallback } from 'react';
import { Immutable, MessageEvent, Topic, SettingsTreeAction, PanelExtensionContext } from "@foxglove/extension";
import { Joy, KbMap } from "../../types";
import { PanelConfig, createDefaultConfig, createKeyboardMapping } from "../../config";
import { settingsActionReducer } from "../../config/panelSettings";

export function useJoyPanelState(context: PanelExtensionContext) {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();
  const [joy, setJoy] = useState<Joy | undefined>();
  const [pubTopic, setPubTopic] = useState<string | undefined>();
  const [kbEnabled, setKbEnabled] = useState<boolean>(true);
  const [trackedKeys, setTrackedKeys] = useState<Map<string, KbMap> | undefined>(() =>
    createKeyboardMapping(),
  );
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();
  const [config, setConfig] = useState<PanelConfig>(() => createDefaultConfig(context));

  const settingsActionHandler = useCallback(
    (action: SettingsTreeAction) => {
      setConfig((prevConfig) => settingsActionReducer(prevConfig, action));
    },
    [setConfig],
  );

  return {
    topics, setTopics,
    messages, setMessages,
    joy, setJoy,
    pubTopic, setPubTopic,
    kbEnabled, setKbEnabled,
    trackedKeys, setTrackedKeys,
    renderDone, setRenderDone,
    config, setConfig,
    settingsActionHandler,
  };
}