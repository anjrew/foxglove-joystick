import {
  Immutable,
  MessageEvent,
  PanelExtensionContext,
  SettingsTreeAction,
  Topic,
} from "@foxglove/extension";
import { fromDate } from "@foxglove/rostime";
import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";

import { createDefaultConfig, createKeyboardMapping } from "../../config";
import { Config, buildSettingsTree, settingsActionReducer } from "../../config/panelSettings";
import { useGamepad } from "../../hooks/useGamepad";
import { Joy, KbMap } from "../../types";
import { GamepadView } from "../GamepadView/GamepadView";
import { SimpleButtonView } from "../SimpleButtonView";

export function JoyPanel({ context }: { readonly context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();
  const [joy, setJoy] = useState<Joy | undefined>();
  const [pubTopic, setPubTopic] = useState<string | undefined>();
  const [kbEnabled, setKbEnabled] = useState<boolean>(true);
  const [trackedKeys, setTrackedKeys] = useState<Map<string, KbMap> | undefined>(() =>
    createKeyboardMapping(),
  );

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  const [config, setConfig] = useState<Config>(() => createDefaultConfig(context));

  const settingsActionHandler = useCallback(
    (action: SettingsTreeAction) => {
      setConfig((prevConfig) => settingsActionReducer(prevConfig, action));
    },
    [setConfig],
  );

  // Register the settings tree
  useEffect(() => {
    context.updatePanelSettingsEditor({
      actionHandler: settingsActionHandler,
      nodes: buildSettingsTree(config, topics),
    });
  }, [config, context, settingsActionHandler, topics]);

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
      setMessages(renderState.currentFrame);
    };

    context.watch("topics");
    context.watch("currentFrame");
  }, [context]);

  // Or subscribe to the relevant topic when in a recorded session
  useEffect(() => {
    if (config.dataSource === "sub-joy-topic") {
      context.subscribe([{ topic: config.subJoyTopic }]);
    } else {
      context.unsubscribeAll();
    }
  }, [config.subJoyTopic, context, config.dataSource]);

  // If subscribing
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
  }, [messages, config.publishFrameId]);

  useGamepad({
    didConnect: useCallback((gp: Gamepad) => {
      setConfig((prevConfig: Config) => {
        return {
          ...prevConfig,
          options: {
            ...prevConfig.options,
            availableControllers: prevConfig.options.availableControllers.concat([gp]),
          },
        };
      });
      console.log("Gamepad " + gp.index + " connected!");
    }, []),

    didDisconnect: useCallback((gp: Gamepad) => {
      setConfig((prevConfig: Config) => {
        return {
          ...prevConfig,
          options: {
            ...prevConfig.options,
            availableControllers: prevConfig.options.availableControllers.filter(
              (c) => c.id !== gp.id,
            ),
          },
        };
      });
      console.log("Gamepad " + gp.index + " disconnected!");
    }, []),

    didUpdate: useCallback(
      (gp: Gamepad) => {
        if (config.dataSource !== "gamepad") {
          return;
        }

        if (config.gamepadId !== gp.index) {
          return;
        }

        console.log("Gamepad " + gp.index + " " + config.layoutName + " updating!");
        if (config.layoutName === "xbox") {
          const triggerLeftAxis: number = gp.buttons[6]?.value ?? 0;
          const triggerRightAxis = gp.buttons[7]?.value ?? 0;

          const tmpJoy = {
            header: {
              frame_id: config.publishFrameId,
              stamp: fromDate(new Date()),
            },
            axes: gp.axes.map((axis) => -axis).concat([triggerLeftAxis, triggerRightAxis]),
            buttons: gp.buttons.map((button, index) =>
              index === 7 || index === 6 ? button.value : button.pressed ? 1 : 0,
            ),
          } as Joy;
          console.log("Xbox Joy message updated", tmpJoy);
          setJoy(tmpJoy);
        } else {
          const tmpJoy = {
            header: {
              frame_id: config.publishFrameId,
              stamp: fromDate(new Date()),
            },
            axes: gp.axes.map((axis) => -axis),
            buttons: gp.buttons.map((button) => (button.pressed ? 1 : 0)),
          } as Joy;
          setJoy(tmpJoy);
        }
      },
      [config.dataSource, config.gamepadId, config.publishFrameId, config.layoutName],
    ),
  });

  // Keyboard mode

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setTrackedKeys((oldTrackedKeys) => {
      if (oldTrackedKeys?.has(event.key) ?? false) {
        const newKeys = new Map(oldTrackedKeys);
        const k = newKeys.get(event.key);
        if (k != undefined) {
          k.value = 1;
        }
        return newKeys;
      }
      return oldTrackedKeys;
    });
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setTrackedKeys((oldTrackedKeys) => {
      const newKeys = new Map(oldTrackedKeys);
      const k = newKeys.get(event.key);
      if (k) {
        k.value = 0;
      }
      return newKeys;
    });
  }, []);

  // Key down Listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Key up Listener
  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  // Generate Joy from Keys
  useEffect(() => {
    if (config.dataSource !== "keyboard") {
      return;
    }
    if (!kbEnabled) {
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

    const tmpJoy = {
      header: {
        frame_id: config.publishFrameId,
        stamp: fromDate(new Date()),
      },
      axes,
      buttons,
    } as Joy;

    setJoy(tmpJoy);
  }, [config.dataSource, trackedKeys, config.publishFrameId, kbEnabled]);

  // Advertise the topic to publish
  useEffect(() => {
    if (config.publishMode) {
      setPubTopic((oldTopic) => {
        if (config.publishMode) {
          if (oldTopic) {
            context.unadvertise?.(oldTopic);
          }
          context.advertise?.(config.pubJoyTopic, "sensor_msgs/Joy");
          return config.pubJoyTopic;
        } else {
          if (oldTopic) {
            context.unadvertise?.(oldTopic);
          }
          return "";
        }
      });
    }
  }, [config.pubJoyTopic, config.publishMode, context]);

  // Publish the joy message
  useEffect(() => {
    if (!config.publishMode) {
      return;
    }

    if (pubTopic && pubTopic === config.pubJoyTopic) {
      context.publish?.(pubTopic, joy);
    }
  }, [context, config.pubJoyTopic, config.publishMode, joy, pubTopic]);

  // Invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  const handleKbSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKbEnabled(event.target.checked);
  };

  const interactiveCb = useCallback(
    (interactiveJoy: Joy) => {
      if (config.dataSource !== "interactive") {
        return;
      }
      const tmpJoy = {
        header: {
          frame_id: config.publishFrameId,
          stamp: fromDate(new Date()),
        },
        axes: interactiveJoy.axes,
        buttons: interactiveJoy.buttons,
      } as Joy;

      setJoy(tmpJoy);
    },
    [config.publishFrameId, config.dataSource, setJoy],
  );

  useEffect(() => {
    context.saveState(config);
  }, [context, config]);

  return (
    <div>
      {config.dataSource === "keyboard" ? (
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={kbEnabled} onChange={handleKbSwitch} />}
            label="Enable Keyboard"
          />
        </FormGroup>
      ) : null}
      {config.displayMode === "auto" ? <SimpleButtonView joy={joy} /> : null}
      {config.displayMode === "custom" ? (
        <GamepadView joy={joy} cbInteractChange={interactiveCb} layoutName={config.layoutName} />
      ) : null}
    </div>
  );
}
export function initJoyPanel(context: PanelExtensionContext): () => void {
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(<JoyPanel context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
