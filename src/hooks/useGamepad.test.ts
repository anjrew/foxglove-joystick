import { renderHook, act } from "@testing-library/react";

import { useGamepad } from "./useGamepad";

describe("useGamepad", () => {
  beforeEach(() => {
    // Mock the Gamepad API
    global.navigator.getGamepads = jest.fn(
      () => [{ id: "Gamepad 1", index: 0, buttons: [], axes: [] }] as unknown as Gamepad[],
    );
  });

  it("calls didConnect when a gamepad is connected", () => {
    const mockDidConnect = jest.fn();
    const mockDidDisconnect = jest.fn();
    const mockDidUpdate = jest.fn();

    renderHook(() => {
      useGamepad({
        didConnect: mockDidConnect,
        didDisconnect: mockDidDisconnect,
        didUpdate: mockDidUpdate,
      });
    });

    // Simulate gamepad connection
    act(() => {
      const connectEvent = new Event("gamepadconnected");
      Object.defineProperty(connectEvent, "gamepad", { value: { id: "Gamepad 1", index: 0 } });
      window.dispatchEvent(connectEvent);
    });

    expect(mockDidConnect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "Gamepad 1", index: 0 }),
    );
  });
});
