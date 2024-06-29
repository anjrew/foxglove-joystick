import { LayoutActions, PanelExtensionContext } from "@foxglove/extension";<AnimationPlaybackEvent
import { render } from "@testing-library/react";

import { JoyPanel } from "./JoyPanel";

const mockDiv: HTMLDivElement = document.createElement("div");

// Mock the PanelExtensionContext
const mockContext: PanelExtensionContext = {
  subscribe: jest.fn(),
  watch: jest.fn(),
  unsubscribeAll: jest.fn(),
  saveState: jest.fn(),
  initialState: {
    subJoyTopic: "/joy",
    pubJoyTopic: "/joy",
    publishMode: false,
    publishFrameId: "",
    dataSource: "sub-joy-topic",
    displayMode: "auto",
    debugGamepad: false,
    layoutName: "steamdeck",
    mapping_name: "TODO",
    gamepadId: 0,
    panelElement: "MockPanelElement",
    layout: "MockLayout",
    sharedPanelState: "MockSharedPanelState",
  },
  panelElement: mockDiv,
  layout: {} as LayoutActions, // Provide a valid value for the layout property
  setParameter: jest.fn(),
  setSharedPanelState: jest.fn(),

  setVariable: jest.fn(),
  setPreviewTime: jest.fn(),
  subscribeAppSettings: jest.fn(),
  updatePanelSettingsEditor: jest.fn(),
  setDefaultPanelTitle: jest.fn(),
};

describe("JoyPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<JoyPanel context={mockContext} />);
  });

  it('subscribes to the correct topic when dataSource is "sub-joy-topic"', () => {
    render(<JoyPanel context={mockContext} />);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockContext.subscribe).toHaveBeenCalledWith([{ topic: "/joy" }]);
  });
});
