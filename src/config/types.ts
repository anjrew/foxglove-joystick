import { GamepadMappingKey } from "../utils/gamepadMappings";

export type PanelConfig = {
  dataSource: string;
  subJoyTopic: string;
  gamepadId: number;
  publishMode: boolean;
  pubJoyTopic: string;
  publishFrameId: string;
  displayMode: string;
  debugGamepad: boolean;
  layoutName: GamepadMappingKey;
  mapping_name: string;
  options: PanelOptions;
};

export type PanelOptions = {
  availableControllers: Gamepad[];
};
