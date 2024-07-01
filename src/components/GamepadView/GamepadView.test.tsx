import { render, screen } from "@testing-library/react";

import { GamepadView } from "./GamepadView";
import { Joy } from "../../types";
import * as gamepadMappings from "../../utils/gamepadMappings";

// Mock the custom hooks
jest.mock("../../hooks/useGamepadInteractions", () => ({
  useGamepadInteractions: () => ({
    handleButtonInteraction: jest.fn(),
    handleAxisInteraction: jest.fn(),
  }),
}));
jest.mock("../../hooks/usePanPrevention", () => ({
  usePanPrevention: jest.fn(),
}));

describe("GamepadView", () => {
  const mockJoy: Joy = {
    header: { frame_id: "", stamp: { sec: 0, nsec: 0 } },
    buttons: [1, 0, 1],
    axes: [0.5, -0.5, 0.75],
  };

  const mockCbInteractChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays "No mapping!" when displayMapping is empty', () => {
    jest.spyOn(gamepadMappings, "getGamepadMapping").mockReturnValue([]);
    render(
      <GamepadView joy={mockJoy} cbInteractChange={mockCbInteractChange} layoutName="unknown" />,
    );
    expect(screen.getByText("No mapping!")).toBeInTheDocument();
  });
});
