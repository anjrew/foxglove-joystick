export interface GamepadComponentConfig {
  type: string;
}

export interface ButtonConfig extends GamepadComponentConfig{
  text: string;
  x: number;
  y: number;
  rot: number;
  button: number;
}

export interface AnalogButtonConfig  extends GamepadComponentConfig{
  text: string;
  rot: number;
  button: number;
}

export interface BarConfig  extends GamepadComponentConfig{
  x: number;
  y: number;
  rot: number;
  axis: number;
}

export interface StickConfig  extends GamepadComponentConfig{
  x: number;
  y: number;
  axisX: number;
  axisY: number;
  button: number;
}

export interface DPadConfig  extends GamepadComponentConfig{
  x: number;
  y: number;
  axisX: number;
  axisY: number;
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
