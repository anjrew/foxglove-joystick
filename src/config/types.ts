export type Config = {
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
  options: Options;
};

export type Options = {
  availableControllers: Gamepad[];
};
