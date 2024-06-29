import { renderHook, act } from '@testing-library/react-hooks';
import { useJoyPanelState } from './useJoyPanelState';
import { PanelExtensionContext } from '@foxglove/extension';
import { Joy } from '../../types';

describe('useJoyPanelState', () => {
  it('should initialize with default values', () => {
    const mockContext = {} as PanelExtensionContext;
    const { result } = renderHook(() => useJoyPanelState(mockContext));

    expect(result.current.joy).toBeUndefined();
    expect(result.current.kbEnabled).toBe(true);
  });

  it('should update joy state', () => {
    const mockContext = {} as PanelExtensionContext;
    const { result } = renderHook(() => useJoyPanelState(mockContext));

    act(() => {
      result.current.setJoy({ buttons: [1, 0], axes: [0.5, -0.5] } as Joy);
    });

    expect(result.current.joy).toEqual({ buttons: [1, 0], axes: [0.5, -0.5] });
  });

});