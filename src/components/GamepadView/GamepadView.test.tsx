import { render } from "@testing-library/react";

import { GamepadView } from "./GamepadView";
import { Joy } from "../../types";

describe("GamepadView", () => {
  it("renders without crashing", () => {
    render(
      <GamepadView
        joy={{
          header: {
            stamp: {
              sec: 0,
              nsec: 0,
            },
            frame_id: "",
          },
          axes: [],
          buttons: [],
        }}
        cbInteractChange={function (_: Joy): void {
          // Implement your function logic here
        }}
        layoutName={"steamdeck"}
      />,
    );
    // If the component renders without throwing an error, the test will pass
  });
});
