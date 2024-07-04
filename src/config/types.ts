import { GamepadJoyTransformKey } from "../mappings/gamepadJoyTransforms";
import { GamepadLayoutMappingKey } from "../mappings/gamepadLayoutMappings";

export type PanelConfig = {
  dataSource: string;
  subJoyTopic: string;
  gamepadId: number;
  publishMode: boolean;
  pubJoyTopic: string;
  publishFrameId: string;
  displayMode: string;
  debugGamepad: boolean;
  layoutName: GamepadLayoutMappingKey;
  gamepadJoyTransform: GamepadJoyTransformKey;
  options: PanelOptions;
};

export type PanelOptions = {
  availableControllers: Gamepad[];
};
