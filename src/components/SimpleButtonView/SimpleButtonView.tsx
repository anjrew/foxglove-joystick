/* eslint-disable react/jsx-key */
import { Button, LinearProgress } from "@mui/material";

import { Joy } from "../../types";

function getButtonColor(value: number): string {
  // Convert value to a hue between 120 (green) and 0 (red)
  const hue = 120 - value * 120;
  return `hsl(${hue}, 100%, 50%)`;
}

export function SimpleButtonView(props: { joy: Joy | undefined }): JSX.Element {
  const buttons = props.joy
    ? props.joy.buttons.map((item: number, index: number) => (
        <Button
          variant={item > 0 ? "contained" : "outlined"}
          size="large"
          style={{ backgroundColor: getButtonColor(item) }}
        >
          {index} ({item})
        </Button>
      ))
    : [];

  const axes = props.joy
    ? props.joy.axes.map((item: number, index: number) => (
        <LinearProgress
          key={index}
          variant="determinate"
          value={item * 50 + 50}
          sx={{ transition: "none" }}
        />
      ))
    : [];

  return (
    <div>
      {props.joy ? null : "Waiting for first data..."}
      {buttons}
      {axes}
    </div>
  );
}
