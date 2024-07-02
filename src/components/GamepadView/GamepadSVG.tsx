/* eslint-disable import/order */
import React from "react";
import { GamepadBackground } from "../GamepadBackground/GamepadBackground";
import { GamepadMappingKey } from "../../utils/gamepadMappings";

export const GamepadSVG: React.FC<{
  layoutName: GamepadMappingKey;
  children: React.ReactNode;
}> = ({ layoutName, children }) => {
  return (
    <svg viewBox="0 0 512 512" className="preventPan">
      <GamepadBackground layoutName={layoutName} />
      {children}
    </svg>
  );
};
