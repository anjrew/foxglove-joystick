import React from "react";

import { GamepadSVG } from "./GamepadSVG";
import { useGamepadData } from "./hooks/useGamepadData";
import { renderGamepadItem } from "./utils/renderGamepadItem";
import { useGamepadInteractions } from "../../hooks/useGamepadInteractions";
import { usePanPrevention } from "../../hooks/usePanPrevention";
import { Joy } from "../../types";
import { GamepadMappingKey } from "../../utils/gamepadMappings";

export function GamepadView({
  joy,
  cbInteractChange,
  layoutName,
}: Readonly<{
  joy: Joy;
  cbInteractChange: (joy: Joy) => void;
  layoutName: GamepadMappingKey;
}>): React.ReactElement {
  const { displayMapping, joyTransformed } = useGamepadData(joy, layoutName);
  const { handleButtonInteraction, handleAxisInteraction } = useGamepadInteractions(
    displayMapping,
    cbInteractChange,
  );
  usePanPrevention();

  if (displayMapping.length === 0) {
    return <h2>No mapping!</h2>;
  }

  if (!joyTransformed) {
    return <h2>Failed to transform joy data!</h2>;
  }

  return (
    <div>
      <GamepadSVG layoutName={layoutName}>
        {displayMapping.map((item, index) => (
          <React.Fragment key={`${item.type}-${index}`}>
            {renderGamepadItem(
              item,
              joyTransformed,
              handleButtonInteraction,
              handleAxisInteraction,
            )}
          </React.Fragment>
        ))}
      </GamepadSVG>
    </div>
  );
}
