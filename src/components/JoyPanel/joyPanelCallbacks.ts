import React, { useCallback } from 'react';
import { fromDate } from "@foxglove/rostime";
import { PanelConfig, Joy, KbMap } from '../../types';

export function useJoyPanelCallbacks(
  config: PanelConfig,
  setConfig: React.Dispatch<React.SetStateAction<PanelConfig>>,
  setJoy: React.Dispatch<React.SetStateAction<Joy | undefined>>,
  setTrackedKeys: React.Dispatch<React.SetStateAction<Map<string, KbMap> | undefined>>,
  setKbEnabled: React.Dispatch<React.SetStateAction<boolean>>
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
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
  }, [setTrackedKeys]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
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
  }, [setTrackedKeys]);

  const interactiveCb = useCallback((interactiveJoy: Joy) => {
    if (config.dataSource !== "interactive") return;
    const tmpJoy = {
      header: {
        frame_id: config.publishFrameId,
        stamp: fromDate(new Date()),
      },
      axes: interactiveJoy.axes,
      buttons: interactiveJoy.buttons,
    } as Joy;
    setJoy(tmpJoy);
  }, [config.dataSource, config.publishFrameId, setJoy]);

  const handleKbSwitch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setKbEnabled(event.target.checked);
  }, [setKbEnabled]);

  const handleGamepadConnect = useCallback((gp: Gamepad) => {
    setConfig((prevConfig: { options: { availableControllers: Gamepad[]; }; }) => ({
      ...prevConfig,
      options: {
        ...prevConfig.options,
        availableControllers: [...prevConfig.options.availableControllers, gp],
      },
    }));
    console.log(`Gamepad ${gp.index} connected!`);
  }, [setConfig]);

  const handleGamepadDisconnect = useCallback((gp: Gamepad) => {
    setConfig((prevConfig: { options: { availableControllers: Gamepad[]; }; }) => ({
      ...prevConfig,
      options: {
        ...prevConfig.options,
        availableControllers: prevConfig.options.availableControllers.filter(
          (c) => c.id !== gp.id
        ),
      },
    }));
    console.log(`Gamepad ${gp.index} disconnected!`);
  }, [setConfig]);

  const handleGamepadUpdate = useCallback((gp: Gamepad) => {
      if (config.dataSource !== "gamepad" || config.gamepadId !== gp.index) {
        return;
      }
  
      console.log(`Gamepad ${gp.index} ${config.layoutName} updating!`);
      const tmpJoy = {
        header: {
          frame_id: config.publishFrameId,
          stamp: fromDate(new Date()),
        },
        axes: gp.axes.map((axis) => -axis),
        buttons: gp.buttons.map((button) => (button.pressed ? 1 : 0)),
      } as Joy;
  
      if (config.layoutName === "xbox") {
        const triggerLeftAxis: number = gp.buttons[6]?.value ?? 0;
        const triggerRightAxis: number = gp.buttons[7]?.value ?? 0;
        tmpJoy.axes = [...tmpJoy.axes, triggerLeftAxis, triggerRightAxis];
  
        const xboxButtons = gp.buttons.map((button, index) => {
          if (index === 6 || index === 7) {
            return button.value;
          } else {
            return button.pressed ? 1 : 0;
          }
        });
        tmpJoy.buttons = xboxButtons;
      }
  
      setJoy(tmpJoy);
    }, [config.dataSource, config.gamepadId, config.layoutName, config.publishFrameId, setJoy]);

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