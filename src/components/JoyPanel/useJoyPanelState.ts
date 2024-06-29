import { useState, useCallback } from 'react';
import { Immutable, MessageEvent, Topic, SettingsTreeAction, PanelExtensionContext } from "@foxglove/extension";
import { Joy, KbMap } from "../../types";
import { PanelConfig, createDefaultConfig, createKeyboardMapping } from "../../config";
import { settingsActionReducer } from "../../config/panelSettings";


export interface UseJoyPanelStateResult {
  topics: undefined | Immutable<Topic[]>;
  setTopics: React.Dispatch<React.SetStateAction<undefined | Immutable<Topic[]>>>;
  messages: undefined | Immutable<MessageEvent[]>;
  setMessages: React.Dispatch<React.SetStateAction<undefined | Immutable<MessageEvent[]>>>;
  joy: Joy | undefined;
  setJoy: React.Dispatch<React.SetStateAction<Joy | undefined>>;
  pubTopic: string | undefined;
  setPubTopic: React.Dispatch<React.SetStateAction<string | undefined>>;
  kbEnabled: boolean;
  setKbEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  trackedKeys: Map<string, KbMap> | undefined;
  setTrackedKeys: React.Dispatch<React.SetStateAction<Map<string, KbMap> | undefined>>;
  renderDone: (() => void) | undefined;
  setRenderDone: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
  config: PanelConfig;
  setConfig: React.Dispatch<React.SetStateAction<PanelConfig>>;
  settingsActionHandler: (action: SettingsTreeAction) => void;
}


export function useJoyPanelState(context?: PanelExtensionContext) {
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