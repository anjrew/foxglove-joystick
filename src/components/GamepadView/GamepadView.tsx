import React from "react";

import { GamepadBackground } from "./GamepadBackground";
import { useGamepadInteractions } from "../../hooks/useGamepadInteractions";
import { usePanPrevention } from "../../hooks/usePanPrevention";
import {
  AnalogButtonBarConfig,
  AxisBarConfig,
  ButtonConfig,
  DPadConfig,
  Joy,
  StickConfig,
} from "../../types";
import { GamepadMappingKey, getGamepadMapping } from "../../utils/gamepadMappings";
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

  return (
    <div>
      {displayMapping.length === 0 ? <h2>No mapping!</h2> : null}
      <svg viewBox="0 0 512 512" className="preventPan">
        <GamepadBackground layoutName={layoutName} />
        {displayMapping.map((item, index) => {
          const key = `${item.type}-${index}`; // Generate a unique key using the item type and index
          switch (item.type) {
            case "button": {
              const buttonConfig = item as ButtonConfig;
              return (
                <GamepadButton
                  key={key}
                  config={buttonConfig}
                  value={joy?.buttons[buttonConfig.button] ?? 0}
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
                  xValue={joy?.axes[stickConfig.axisX] ?? 0}
                  yValue={joy?.axes[stickConfig.axisY] ?? 0}
                  buttonValue={joy?.buttons[stickConfig.button] ?? 0}
                  onInteraction={handleAxisInteraction}
                />
              );
            }
            case "d-pad": {
              const dpadConfig = item as DPadConfig;
              return (
                <GamepadDPad
                  key={key}
                  config={dpadConfig}
                  xValue={joy?.axes[dpadConfig.axisX] ?? 0}
                  yValue={joy?.axes[dpadConfig.axisY] ?? 0}
                />
              );
            }
            case "bar": {
              if ("axis" in item) {
                const barConfig = item as AxisBarConfig;
                return (
                  <GamepadBar key={key} config={barConfig} value={joy?.axes[barConfig.axis] ?? 0} />
                );
              }
              if ("button" in item) {
                const barConfig = item as AnalogButtonBarConfig;
                return (
                  <GamepadBar
                    key={key}
                    config={barConfig}
                    value={joy?.buttons[barConfig.button] ?? 0}
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
