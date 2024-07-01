import { PanelExtensionContext } from "@foxglove/extension";
import { useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";

import { JoyPanelView } from "./JoyPanelView";
import { useJoyPanelCallbacks } from "./joyPanelCallbacks";
import { useJoyPanelEffects } from "./useJoyPanelEffects";
import { useJoyPanelState } from "./useJoyPanelState";
import { useGamepad } from "../../hooks/useGamepad";

export function JoyPanel({ context }: { readonly context: PanelExtensionContext }): JSX.Element {
  const {
    config,
    setConfig,
    joy,
    setJoy,
    setTopics,
    messages,
    setMessages,
    pubTopic,
    setPubTopic,
    kbEnabled,
    setKbEnabled,
    trackedKeys,
    setTrackedKeys,
    renderDone,
    setRenderDone,
  } = useJoyPanelState(context);

  const callbacks = useJoyPanelCallbacks(config, setConfig, setJoy, setTrackedKeys, setKbEnabled);

  // Setup render handling
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
      setMessages(renderState.currentFrame);
    };

    context.watch("topics");
    context.watch("currentFrame");
  }, [context, setMessages, setRenderDone, setTopics]);

  // Use gamepad hook
  useGamepad({
    didConnect: callbacks.handleGamepadConnect,
    didDisconnect: callbacks.handleGamepadDisconnect,
    didUpdate: callbacks.handleGamepadUpdate,
  });

  // Apply all other effects
  useJoyPanelEffects({
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
  });

  // Invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
    <JoyPanelView
      config={config}
      joy={joy}
      kbEnabled={kbEnabled}
      handleKbSwitch={callbacks.handleKbSwitch}
      interactiveCb={callbacks.interactiveCb}
    />
  );
}

export function initJoyPanel(context: PanelExtensionContext): () => void {
  ReactDOM.render(<JoyPanel context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
