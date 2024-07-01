import { fromDate } from "@foxglove/rostime";
import React, { useCallback } from "react";

import { PanelConfig } from "../../config";
import { Joy, KbMap } from "../../types";
import { getGameToJoyTransform } from "../../utils/gamepadMappings";

export function useJoyPanelCallbacks(
  config: PanelConfig,
  setConfig: React.Dispatch<React.SetStateAction<PanelConfig>>,
  setJoy: React.Dispatch<React.SetStateAction<Joy | undefined>>,
  setTrackedKeys: React.Dispatch<React.SetStateAction<Map<string, KbMap> | undefined>>,
  setKbEnabled: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      setTrackedKeys((oldTrackedKeys) => {
        if (oldTrackedKeys?.has(event.key)) {
          const newKeys = new Map(oldTrackedKeys);
          const k = newKeys.get(event.key);
          if (k !== undefined) {
            k.value = 1;
          }
          return newKeys;
        }
        return oldTrackedKeys;
      });
    },
    [setTrackedKeys],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      setTrackedKeys((oldTrackedKeys) => {
        if (oldTrackedKeys) {
          const newKeys = new Map(oldTrackedKeys);
          const k = newKeys.get(event.key);
          if (k) {
            k.value = 0;
          }
          return newKeys;
        }
        return oldTrackedKeys;
      });
    },
    [setTrackedKeys],
  );

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
    [config.dataSource, config.publishFrameId, setJoy],
  );

  const handleKbSwitch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKbEnabled(event.target.checked);
    },
    [setKbEnabled],
  );

  const handleGamepadConnect = useCallback(
    (gp: Gamepad) => {
      setConfig((prevConfig: PanelConfig) => ({
        ...prevConfig,
        options: {
          ...prevConfig.options,
          availableControllers: [...prevConfig.options.availableControllers, gp],
        },
        dataSource: prevConfig.dataSource,
        subJoyTopic: prevConfig.subJoyTopic,
        gamepadId: prevConfig.gamepadId,
        publishMode: prevConfig.publishMode,
        // Add other missing properties here
      }));
      console.log(`Gamepad ${gp.index} connected!`);
    },
    [setConfig],
  );

  const handleGamepadDisconnect = useCallback(
    (gp: Gamepad) => {
      setConfig((prevConfig: PanelConfig) => {
        const newOptions = {
          ...prevConfig.options,
          availableControllers: prevConfig.options.availableControllers.filter(
            (c) => c.id !== gp.id,
          ),
        };
        return {
          ...prevConfig,
          options: newOptions,
        };
      });
      console.log(`Gamepad ${gp.index} disconnected!`);
    },
    [setConfig],
  );

  const handleGamepadUpdate = useCallback(
    (gp: Gamepad) => {
      if (config.dataSource !== "gamepad" || config.gamepadId !== gp.index) {
        return;
      }
      setJoy(getGameToJoyTransform(config.publishFrameId, config.layoutName, gp));
    },
    [config.dataSource, config.gamepadId, config.layoutName, config.publishFrameId, setJoy],
  );

  return {
    handleKeyDown,
    handleKeyUp,
    interactiveCb,
    handleKbSwitch,
    handleGamepadConnect,
    handleGamepadDisconnect,
    handleGamepadUpdate,
  };
}
