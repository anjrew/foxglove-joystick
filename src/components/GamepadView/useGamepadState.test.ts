import { renderHook, act } from '@testing-library/react-hooks';
import { useGamepadState, PointerEventType } from './useGamepadState';

const mockCbInteractChange = jest.fn();

describe('useGamepadState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGamepadState('xbox', mockCbInteractChange));

    expect(result.current.numButtons).toBe(0);
    expect(result.current.numAxes).toBe(0);
    expect(result.current.interactions).toEqual([]);
    expect(result.current.displayMapping).toEqual([]);
  });

  it('should set displayMapping based on layoutName', () => {
    const { result, rerender } = renderHook(({ layoutName }) => useGamepadState(layoutName, mockCbInteractChange), {
      initialProps: { layoutName: 'xbox' },
    });

    expect(result.current.displayMapping).toBeDefined();

    rerender({ layoutName: 'steamdeck' });
    expect(result.current.displayMapping).toBeDefined();

    rerender({ layoutName: 'unknown' });
    expect(result.current.displayMapping).toEqual([]);
  });

  it('should update interactions and call cbInteractChange on button down and up', () => {
    const { result } = renderHook(() => useGamepadState('xbox', mockCbInteractChange));

    const mockEvent = {
      pointerId: 1,
      currentTarget: { setPointerCapture: jest.fn() },
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.buttonCb(0, mockEvent, PointerEventType.Down);
    });

    expect(result.current.interactions?.length ?? 0).toBe(1);
    expect(mockCbInteractChange).toHaveBeenCalled();

    act(() => {
      result.current.buttonCb(0, mockEvent, PointerEventType.Up);
    });

    expect(result.current.interactions).toHaveLength(0);
  });

  it('should update interactions and call cbInteractChange on axis down, move, and up', () => {
    const { result } = renderHook(() => useGamepadState('xbox', mockCbInteractChange));

    const mockEvent = {
      pointerId: 1,
      currentTarget: {
        setPointerCapture: jest.fn(),
        getBoundingClientRect: () => ({ left: 0, right: 100, top: 0, bottom: 100 }),
      },
      clientX: 50,
      clientY: 50,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.axisCb(0, 1, mockEvent, PointerEventType.Down);
    });

    expect(result.current.interactions).toHaveLength(1);
    expect(mockCbInteractChange).toHaveBeenCalled();

    act(() => {
      result.current.axisCb(0, 1, mockEvent, PointerEventType.Move);
    });

    expect(result.current.interactions[0]?.axis1Val).toBeCloseTo(0);
    expect(result.current.interactions[0]?.axis2Val).toBeCloseTo(0);

    act(() => {
      result.current.axisCb(0, 1, mockEvent, PointerEventType.Up);
    });

    expect(result.current.interactions).toHaveLength(0);
  });
});
