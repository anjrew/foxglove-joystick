import React from "react";
import { BarConfig, ButtonConfig, DPadConfig, Joy, StickConfig } from "../../types";
import { useGamepadInteractions } from "../../hooks/useGamepadInteractions";
import { usePanPrevention } from "../../hooks/usePanPrevention";
import { getGamepadMapping } from "../../utils/gamepadMappings";
import { GamepadBackground } from "./GamepadBackground";
import { GamepadButton } from "../GamepadButton";
import { GamepadStick } from "../GamepadStick";
import { GamepadDPad } from "../GamepadDPad";
import { GamepadBar } from "../GamepadBar";

export function GamepadView(props: Readonly<{
  joy: Joy | undefined;
  cbInteractChange: (joy: Joy) => void;
  layoutName: string;
}>): React.ReactElement {
  const { joy, cbInteractChange, layoutName } = props;

  const displayMapping = getGamepadMapping(layoutName);
  const { handleButtonInteraction, handleAxisInteraction } = 
    useGamepadInteractions(displayMapping, cbInteractChange);

  usePanPrevention();

  return (
    <div>
      {displayMapping.length === 0 ? <h2>No mapping!</h2> : null}
      <svg viewBox="0 0 512 512" className="preventPan">
        <GamepadBackground layoutName={layoutName} />
        {displayMapping.map((item, index) => {
          switch (item.type) {
            case "button": {
              const buttonConfig = item as ButtonConfig;
              return (
                <GamepadButton
                  key={index}
                  config={buttonConfig}
                  value={joy?.buttons[buttonConfig.button] ?? 0}
                  onInteraction={handleButtonInteraction}
                />
              );
            }
            case "stick":
              const stickConfig = item as StickConfig;

              return (
                <GamepadStick
                  key={index}
                  config={stickConfig}
                  xValue={joy?.axes[stickConfig.axisX] ?? 0}
                  yValue={joy?.axes[stickConfig.axisY] ?? 0}
                  buttonValue={joy?.buttons[stickConfig.button] ?? 0}
                  onInteraction={handleAxisInteraction}
                />
              );
            case "d-pad":
              const dpadConfig = item as DPadConfig;

              return (
                <GamepadDPad
                  key={index}
                  config={dpadConfig}
                  xValue={joy?.axes[dpadConfig.axisX] ?? 0}
                  yValue={joy?.axes[dpadConfig.axisY] ?? 0}
                />
              );
            case "bar":
              const barConfig = item as BarConfig;

              return (
                <GamepadBar
                  key={index}
                  config={barConfig}
                  value={joy?.axes[barConfig.axis] ?? 0}
                />
              );
            default:
              return null;
          }
        })}
      </svg>
    </div>
  );
}