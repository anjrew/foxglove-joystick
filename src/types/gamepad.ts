export interface ButtonConfig {
  type: string;
  text: string;
  x: number;
  y: number;
  rot: number;
  button: number;
}

export interface AnalogButtonConfig {
  type: string;
  text: string;
  rot: number;
  button: number;
}

export interface BarConfig {
  type: string;
  x: number;
  y: number;
  rot: number;
  axis: number;
}

export interface StickConfig {
  type: string;
  x: number;
  y: number;
  axisX: number;
  axisY: number;
  button: number;
}

export interface DPadConfig {
  type: string;
  x: number;
  y: number;
  axisX: number;
  axisY: number;
}

export type DisplayMapping = (ButtonConfig | BarConfig | StickConfig | DPadConfig)[];
