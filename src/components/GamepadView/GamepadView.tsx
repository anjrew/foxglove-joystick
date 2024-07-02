import React from "react";

import { useGamepadInteractions } from "../../hooks/useGamepadInteractions";
import { usePanPrevention } from "../../hooks/usePanPrevention";
import {
  AnalogButtonBarConfig,
  AxisBarConfig,
  ButtonConfig,
  Joy,
  StickConfig,
  isDPadAxisConfig,
  isDPadButtonConfig,
} from "../../types";
import { GamepadMappingKey, getGamepadMapping, transformJoy } from "../../utils/gamepadMappings";
import { GamepadBackground } from "../GamepadBackground/GamepadBackground";
import { GamepadBar } from "../GamepadBar";
import { GamepadButton } from "../GamepadButton";
import { GamepadDPad } from "../GamepadDPad";
import { GamepadStick } from "../GamepadStick";

export function GamepadView(
  props: Readonly<{
    joy: Joy | undefined;
    cbInteractChange: (joy: Joy) => void;
    layoutName: GamepadMappingKey;
  }>,
): React.ReactElement {
  const { joy, cbInteractChange, layoutName } = props;

  // Get layout mapping
  const displayMapping = getGamepadMapping(layoutName);

  const { handleButtonInteraction, handleAxisInteraction } = useGamepadInteractions(
    displayMapping,
    cbInteractChange,
  );
  usePanPrevention();

  if (!joy) {
    return <h2>No joy data!</h2>;
  }
  const joyTransformed = transformJoy(layoutName, joy);

  return (
    <div>
      {displayMapping.length === 0 ? <h2>No mapping!</h2> : null}
      <svg viewBox="0 0 512 512" className="preventPan">
        <GamepadBackground layoutName={layoutName} />
        {displayMapping.map((item, index) => {
          const key = `${item.type}-${index}`; // Generate a unique key using the item type and index
          switch ((item as { type: string }).type) {
            case "button": {
              const buttonConfig = item as ButtonConfig;
              return (
                <GamepadButton
                  key={key}
                  config={buttonConfig}
                  value={joyTransformed.buttons[buttonConfig.button] ?? 0}
                  onInteraction={handleButtonInteraction}
                />
              );
            }
            case "stick": {
              const stickConfig = item as StickConfig;
              return (
                <GamepadStick
                  key={key}
                  config={stickConfig}
                  xValue={joyTransformed.axes[stickConfig.axisX] ?? 0}
                  yValue={joyTransformed.axes[stickConfig.axisY] ?? 0}
                  buttonValue={joyTransformed.buttons[stickConfig.button] ?? 0}
                  onInteraction={handleAxisInteraction}
                />
              );
            }
            case "d-pad": {
              if (isDPadAxisConfig(item)) {
                const dpadAxisConfig = item;
                return (
                  <GamepadDPad
                    key={key}
                    config={dpadAxisConfig}
                    xValue={joyTransformed.axes[dpadAxisConfig.axisX] ?? 0}
                    yValue={joyTransformed.axes[dpadAxisConfig.axisY] ?? 0}
                  />
                );
              }
              if (isDPadButtonConfig(item)) {
                const dpadButtonConfig = item;
                let xValue = 0;
                let yValue = 0;

                if (joyTransformed.buttons[dpadButtonConfig.right] === 1) {
                  xValue = 1;
                } else if (joyTransformed.buttons[dpadButtonConfig.left] === 1) {
                  xValue = -1;
                }

                if (joyTransformed.buttons[dpadButtonConfig.down] === 1) {
                  yValue = 1;
                } else if (joyTransformed.buttons[dpadButtonConfig.up] === 1) {
                  yValue = -1;
                }
                return (
                  <GamepadDPad
                    key={key}
                    config={dpadButtonConfig}
                    xValue={xValue}
                    yValue={yValue}
                  />
                );
              }
              throw new Error(
                "Invalid d-pad config:" +
                  Object.keys(item)
                    .map((k) => `{k}: ${item[k]}`)
                    .toString(),
              );
            }
            case "bar": {
              if ("axis" in item) {
                const barConfig = item as AxisBarConfig;
                return (
                  <GamepadBar
                    key={key}
                    config={barConfig}
                    value={joyTransformed.axes[barConfig.axis] ?? 0}
                  />
                );
              }
              if ("button" in item) {
                const barConfig = item as AnalogButtonBarConfig;
                return (
                  <GamepadBar
                    key={key}
                    config={barConfig}
                    value={joyTransformed.buttons[barConfig.button] ?? 0}
                  />
                );
              }
              console.error("Invalid bar config:", item);
              return null;
            }
            default:
              console.error("Unknown mapping item type:", item);
              return null;
          }
        })}
      </svg>
    </div>
  );
}
