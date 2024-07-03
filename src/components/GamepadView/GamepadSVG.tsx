/* eslint-disable import/order */
import React from "react";
import { GamepadBackground } from "../GamepadBackground/GamepadBackground";
import { GamepadLayoutMappingKey } from "../../mappings/gamepadLayoutMappings";

export const GamepadSVG: React.FC<{
  layoutName: GamepadLayoutMappingKey;
  children: React.ReactNode;
}> = ({ layoutName, children }) => {
  return (
    <svg viewBox="0 0 512 512" className="preventPan">
      <GamepadBackground layoutName={layoutName} />
      {children}
    </svg>
  );
};
