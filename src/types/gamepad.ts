export interface GamepadComponentConfig {
  type: string; // The type of the component
  x: number; // The x position of the component
  y: number; // The y position of the component
  text: string; // The text to display on the component
  rot: number; // The rotation of the component
}

export interface ButtonConfig extends GamepadComponentConfig {
  button: number;
}

export interface AnalogButtonConfig extends GamepadComponentConfig {
  button: number;
}

export interface AxisBarConfig extends GamepadComponentConfig {
  axis: number;
}

export interface AnalogButtonBarConfig extends GamepadComponentConfig {
  button: number;
}

export interface StickConfig extends GamepadComponentConfig {
  axisX: number;
  axisY: number;
  button: number;
}

export interface DPadAxisConfig extends GamepadComponentConfig {
  axisX: number;
  axisY: number;
}

export interface DPadButtonConfig extends GamepadComponentConfig {
  up: number;
  right: number;
  down: number;
  left: number;
}

export interface Interaction {
  pointerId: number;
  buttonIdx: number;
  axis1Idx: number;
  axis2Idx: number;
  buttonVal: number;
  axis1Val: number;
  axis2Val: number;
}

export enum PointerEventType {
  Down,
  Move,
  Up,
}

export type DisplayMapping = Array<GamepadComponentConfig>;

export type BarConfig = AnalogButtonBarConfig | AxisBarConfig;

export function isDPadAxisConfig(obj: unknown): obj is DPadAxisConfig {
  return (
    typeof obj === "object" &&
    obj != null &&
    "x" in obj &&
    "y" in obj &&
    "axisX" in obj &&
    "axisY" in obj &&
    typeof obj.x === "number" &&
    typeof obj.y === "number" &&
    typeof obj.axisX === "number" &&
    typeof obj.axisY === "number"
  );
}

export function isDPadButtonConfig(obj: unknown): obj is DPadButtonConfig {
  return (
    typeof obj === "object" &&
    obj != null &&
    "up" in obj &&
    "right" in obj &&
    "down" in obj &&
    "left" in obj &&
    typeof obj.up === "number" &&
    typeof obj.right === "number" &&
    typeof obj.down === "number" &&
    typeof obj.left === "number"
  );
}

export function isDPadConfig(obj: unknown): obj is DPadAxisConfig | DPadButtonConfig {
  return isDPadAxisConfig(obj) || isDPadButtonConfig(obj as DPadButtonConfig);
}
