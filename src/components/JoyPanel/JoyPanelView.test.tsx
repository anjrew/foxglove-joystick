import { render, screen } from '@testing-library/react';
import { JoyPanelView } from './JoyPanelView';
import { Joy } from '../../types';
import { PanelConfig, createDefaultConfig } from '../../config';

describe('JoyPanelView', () => {
  const mockConfig: PanelConfig = {
    ...createDefaultConfig(),
    dataSource: 'keyboard',
    displayMode: 'auto',
  };

  const mockJoy: Joy = {
    axes: [0, 1],
    buttons: [1, 0],
    header: { stamp: { sec: 0, nsec: 0 }, frame_id: 'test' },
  };

  const mockHandleKbSwitch = jest.fn();
  const mockInteractiveCb = jest.fn();

  it('renders keyboard switch when data source is keyboard', () => {
    render(
      <JoyPanelView
        config={mockConfig}
        joy={mockJoy}
        kbEnabled={true}
        handleKbSwitch={mockHandleKbSwitch}
        interactiveCb={mockInteractiveCb}
      />
    );

    expect(screen.getByText('Enable Keyboard')).toBeInTheDocument();
  });

  it('renders SimpleButtonView when display mode is auto', () => {
    render(
      <JoyPanelView
        config={mockConfig}
        joy={mockJoy}
        kbEnabled={true}
        handleKbSwitch={mockHandleKbSwitch}
        interactiveCb={mockInteractiveCb}
      />
    );

    // Assuming SimpleButtonView renders buttons with their index
    expect(screen.getByText('0 (1)')).toBeInTheDocument();
    expect(screen.getByText('1 (0)')).toBeInTheDocument();
  });

});