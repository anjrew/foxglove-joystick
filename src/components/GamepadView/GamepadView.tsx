import React from "react";

import { GamepadSVG } from "./GamepadSVG";
import { renderGamepadItem } from "./utils/renderGamepadItem";
import { useGamepadInteractions } from "../../hooks/useGamepadInteractions";
import { usePanPrevention } from "../../hooks/usePanPrevention";
import {
  GamepadLayoutMappingKey,
  getGamepadLayoutMapping,
} from "../../mappings/gamepadLayoutMappings";
import { Joy } from "../../types";

export function GamepadView({
  joy,
  cbInteractChange,
  layoutName,
}: Readonly<{
  joy: Joy;
  cbInteractChange: (joy: Joy) => void;
  layoutName: GamepadLayoutMappingKey;
}>): React.ReactElement {
  const displayMapping = getGamepadLayoutMapping(layoutName);

  const { handleButtonInteraction, handleAxisInteraction } = useGamepadInteractions(
    displayMapping,
    cbInteractChange,
  );
  usePanPrevention();

  if (displayMapping.length === 0) {
    return <h2>No mapping!</h2>;
  }

  return (
    <div>
      <GamepadSVG layoutName={layoutName}>
        {displayMapping.map((item, index) => (
          <React.Fragment key={`${item.type}-${index}`}>
            {renderGamepadItem(item, joy, handleButtonInteraction, handleAxisInteraction)}
          </React.Fragment>
        ))}
      </GamepadSVG>
    </div>
  );
}
