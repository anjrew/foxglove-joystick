import { renderHook, act } from '@testing-library/react-hooks';
import { useGamepadState, PointerEventType } from './useGamepadState';
import { getGamepadMapping } from '../../utils/gamepadMappings';



describe('useGamepadState', () => {
  const mockCbInteractChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

});