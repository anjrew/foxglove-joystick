import React from "react";

import { CheapoBackground } from "./CheapoBackground";
import { IpegaBackground } from "./IpegaBackground";
import { SteamDeckBackground } from "./SteamDeckBackground";
import { XboxBackground } from "./XboxBackground";

export function GamepadBackground(props: Readonly<{ layoutName: string }>): React.ReactElement {
  const { layoutName } = props;

  switch (layoutName) {
    case "steamdeck":
      return <SteamDeckBackground />;
    case "ipega-9083s":
      return <IpegaBackground />;
    case "xbox":
      return <XboxBackground />;
    case "xbox2":
      return <XboxBackground />;
    case "cheapo":
      return <CheapoBackground />;
    default:
      return <g>Unknown Layout: {layoutName}</g>;
  }
}
