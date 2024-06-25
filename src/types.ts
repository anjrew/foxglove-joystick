import { Time } from "@foxglove/rostime";

type Header = {
  stamp: Time;
  frame_id: string;
};

// sensor_msgs/Joy message definition
// http://docs.ros.org/en/api/sensor_msgs/html/msg/Joy.html
export type Joy = {
  header: Header;
  axes: number[];
  buttons: number[];
};

export interface ButtonConfig {
  type: string;
  text: string;
  x: number;
  y: number;
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

export interface DPadAxisConfig {
  type: string;
  x: number;
  y: number;
  axisX: number;
  axisY: number;
}

export interface DPadButtonConfig {
  type: string;
  buttons: {
    up: number;
    down: number;
    left: number;
    right: number;
  },
  x: number;
  y: number;
}

export type DisplayMapping = (ButtonConfig | BarConfig | StickConfig | DPadAxisConfig | DPadButtonConfig)[];
