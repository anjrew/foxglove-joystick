import { render, screen } from '@testing-library/react';
import { GamepadView } from './GamepadView';
import { Joy } from '../../types';
import * as gamepadMappings from '../../utils/gamepadMappings';



// Mock the custom hooks
jest.mock('../../hooks/useGamepadInteractions', () => ({
  useGamepadInteractions: () => ({
    handleButtonInteraction: jest.fn(),
    handleAxisInteraction: jest.fn(),
  }),
}));
jest.mock('../../hooks/usePanPrevention', () => ({
  usePanPrevention: jest.fn(),
}));

describe('GamepadView', () => {
  const mockJoy: Joy = {
    header: { frame_id: '', stamp: { sec: 0, nsec: 0 } },
    buttons: [1, 0, 1],
    axes: [0.5, -0.5, 0.75],
  };

  const mockCbInteractChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<GamepadView joy={mockJoy} cbInteractChange={mockCbInteractChange} layoutName="xbox" />);
    expect(screen.getByTestId('gamepad-background')).toBeInTheDocument();
  });

  it('displays "No mapping!" when displayMapping is empty', () => {
    jest.spyOn(gamepadMappings, 'getGamepadMapping').mockReturnValue([]);
    render(<GamepadView joy={mockJoy} cbInteractChange={mockCbInteractChange} layoutName="unknown" />);
    expect(screen.getByText('No mapping!')).toBeInTheDocument();
  });

  it('renders correct number of each component type based on mapping', () => {
    const mockMapping = [
      { type: 'button', button: 0, x: 0, y: 0, text: 'A' },
      { type: 'stick', axisX: 0, axisY: 1, button: 1, x: 0, y: 0 },
      { type: 'd-pad', axisX: 2, axisY: 3, x: 0, y: 0 },
      { type: 'bar', axis: 4, x: 0, y: 0, rot: 0 },
    ];
    jest.spyOn(gamepadMappings, 'getGamepadMapping').mockReturnValue(mockMapping);

    render(<GamepadView joy={mockJoy} cbInteractChange={mockCbInteractChange} layoutName="xbox" />);

    expect(screen.getAllByTestId('gamepad-button')).toHaveLength(1);
    expect(screen.getAllByTestId('gamepad-stick')).toHaveLength(1);
    expect(screen.getAllByTestId('gamepad-dpad')).toHaveLength(1);
    expect(screen.getAllByTestId('gamepad-bar')).toHaveLength(1);
  });

  it('passes correct props to child components', () => {
    const mockMapping = [
      { type: 'button', button: 0, x: 0, y: 0, text: 'A' },
      { type: 'stick', axisX: 0, axisY: 1, button: 1, x: 0, y: 0 },
    ];
    jest.spyOn(gamepadMappings, 'getGamepadMapping').mockReturnValue(mockMapping);

    const { container } = render(<GamepadView joy={mockJoy} cbInteractChange={mockCbInteractChange} layoutName="xbox" />);

    const buttonElement = container.querySelector('[data-testid="gamepad-button"]');
    expect(buttonElement).toHaveAttribute('value', '1');

    const stickElement = container.querySelector('[data-testid="gamepad-stick"]');
    expect(stickElement).toHaveAttribute('xValue', '0.5');
    expect(stickElement).toHaveAttribute('yValue', '-0.5');
    expect(stickElement).toHaveAttribute('buttonValue', '0');
  });
});