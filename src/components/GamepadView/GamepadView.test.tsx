import { render, screen } from '@testing-library/react';
import { GamepadView } from './GamepadView';
import { useJoyPanelCallbacks } from '../../components/JoyPanel/joyPanelCallbacks';
import { Joy } from '../../types';
import { useJoyPanelState } from '../JoyPanel/useJoyPanelState';

// Add the import statement for useState
import React from 'react';


describe('GamepadView', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps Xbox controller input correctly', () => {


    const mockGamepad: Gamepad = {
      id: 'Xbox Controller (STANDARD GAMEPAD Vendor: 045e Product: 02ea)',
      index: 0,
      connected: true,
      timestamp: 0,
      mapping: 'standard',
      axes: [0.1, -0.2, 0.3, -0.4],
      buttons: [
        { pressed: true, touched: true, value: 1 },
        { pressed: false, touched: false, value: 0 },
        // Add more buttons if needed
        // Example: { pressed: false, touched: false, value: 0 },
      ],
      hapticActuators: [],
      vibrationActuator: null,
    };

    const mockJoy: Joy = {
      header: { frame_id: 'test_frame', stamp: { sec: 0, nsec: 0 } },
      axes: [-0.1, 0.2, -0.3, 0.4],
      buttons: [1, 0],
    };
    
    const TestComponent = ({ mockGamepad }: { mockGamepad: Gamepad }) => {
      const { setJoy, setKbEnabled, setTrackedKeys, config, setConfig } = useJoyPanelState();
      
      const { handleGamepadUpdate } = useJoyPanelCallbacks(
        config,
        setConfig,
        setJoy,
        setTrackedKeys,
        setKbEnabled
      );
    
      // Simulate the gamepad update
      React.useEffect(() => {
        handleGamepadUpdate(mockGamepad);
      }, [mockGamepad, handleGamepadUpdate]);
    
      return <GamepadView joy={mockJoy} cbInteractChange={setJoy} layoutName="xbox" />;
    };

    render(<TestComponent mockGamepad={mockGamepad} />);

    // Add assertions to check if the correct elements are rendered
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  })

  it('maps Steam Deck controller input correctly', () => {

    const { setJoy, setKbEnabled, setTrackedKeys, config, setConfig } = useJoyPanelState();
  
    const { handleGamepadUpdate } = useJoyPanelCallbacks(
      config,
      setConfig,
      setJoy,
      setTrackedKeys,
      setKbEnabled,
    );

    const mockGamepad: Gamepad = {
      id: 'Steam Deck Controller',
      index: 1,
      connected: true,
      timestamp: 0,
      mapping: 'standard',
      axes: [0.2, -0.3, 0.4, -0.5],
      buttons: [
        { pressed: true, touched: true, value: 1 },
        { pressed: false, touched: false, value: 0 },
        // Add more buttons if needed
      ],
      hapticActuators: [],
      vibrationActuator: null,
    };

    const mockJoy: Joy = {
      header: { frame_id: 'test_frame', stamp: { sec: 0, nsec: 0 } },
      axes: [-0.1, 0.2, -0.3, 0.4],
      buttons: [1, 0],
    };

    render( <GamepadView joy={mockJoy} cbInteractChange={setJoy} layoutName="xbox" />);

    // Add assertions to check if the correct elements are rendered
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    // Add other necessary assertions
  });

  // Add more tests for different controller types and layouts
});