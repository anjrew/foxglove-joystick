export type PanelConfig = {
  dataSource: string;
  subJoyTopic: string;
  gamepadId: number;
  publishMode: boolean;
  pubJoyTopic: string;
  publishFrameId: string;
  displayMode: string;
  debugGamepad: boolean;
  layoutName: string;
  mapping_name: string;
  options: PanelOptions;
};

export type PanelOptions = {
  availableControllers: Gamepad[];
};
