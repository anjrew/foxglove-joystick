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
  beforeEach(() => {
    jest.clearAllMocks();
  });
});
