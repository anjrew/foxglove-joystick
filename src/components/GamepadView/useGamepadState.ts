import { useCallback, useEffect, useState } from "react";

import {
  GamepadLayoutMappingKey,
  getGamepadLayoutMapping,
} from "../../mappings/gamepadLayoutMappings";
import { Joy, ButtonConfig, StickConfig, DisplayMapping } from "../../types";

interface Interaction {
  pointerId: number;
  buttonIdx: number;
  axis1Idx: number;
  axis2Idx: number;
  buttonVal: number;
  axis1Val: number;
  axis2Val: number;
}

export enum PointerEventType {
  Down,
  Move,
  Up,
}

export const useGamepadState = (
  layoutName: GamepadLayoutMappingKey,
  cbInteractChange: (joy: Joy) => void,
): {
  numButtons: number;
  numAxes: number;
  interactions: Interaction[];
  displayMapping: DisplayMapping;
  buttonCb: (idx: number, e: React.PointerEvent, eventType: PointerEventType) => void;
  axisCb: (idxX: number, idxY: number, e: React.PointerEvent, eventType: PointerEventType) => void;
} => {
  const [numButtons, setNumButtons] = useState<number>(0);
  const [numAxes, setNumAxes] = useState<number>(0);
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  const displayMapping = getGamepadLayoutMapping(layoutName);

  useEffect(() => {
    if (displayMapping.length === 0) {
      setNumButtons(0);
      setNumAxes(0);
    } else {
      // Calculate number of buttons
      const mappedButtons = displayMapping
        .filter((item): item is ButtonConfig => item.type === "button")
        .map((item) => item.button);
      const amountOfButtons = mappedButtons.length > 0 ? Math.max(...mappedButtons) + 1 : 0;
      setNumButtons(amountOfButtons);

      // Calculate number of axes
      const stickConfigs = displayMapping.filter(
        (item): item is StickConfig => item.type === "stick",
      );
      const maxAxisIndex = stickConfigs.reduce(
        (max, stick) => Math.max(max, stick.axisX, stick.axisY),
        -1,
      );
      const numberOfAxes = maxAxisIndex + 1;
      setNumAxes(numberOfAxes);
    }
  }, [displayMapping]);

  useEffect(() => {
    const tmpJoy = {
      header: {
        frame_id: "",
        stamp: { sec: 0, nsec: 0 },
      },
      buttons: Array<number>(Math.max(numButtons, 0)).fill(0),
      axes: Array<number>(Math.max(numAxes, 0)).fill(0),
    } as Joy;

    interactions.forEach((inter) => {
      if (inter.buttonIdx >= 0 && inter.buttonIdx < numButtons) {
        tmpJoy.buttons[inter.buttonIdx] = inter.buttonVal;
      }
      if (inter.axis1Idx >= 0 && inter.axis1Idx < numAxes) {
        tmpJoy.axes[inter.axis1Idx] = inter.axis1Val;
      }
      if (inter.axis2Idx >= 0 && inter.axis2Idx < numAxes) {
        tmpJoy.axes[inter.axis2Idx] = inter.axis2Val;
      }
    });

    cbInteractChange(tmpJoy);
  }, [numButtons, numAxes, interactions, cbInteractChange]);

  const buttonCb = useCallback(
    (idx: number, e: React.PointerEvent, eventType: PointerEventType) => {
      switch (eventType) {
        case PointerEventType.Down:
          e.currentTarget.setPointerCapture(e.pointerId);
          setInteractions((inter) => [
            ...inter,
            {
              pointerId: e.pointerId,
              buttonIdx: idx,
              buttonVal: 1,
              axis1Idx: -1,
              axis1Val: -1,
              axis2Idx: -1,
              axis2Val: -1,
            },
          ]);
          break;
        case PointerEventType.Move:
          break;
        case PointerEventType.Up:
          setInteractions((inter) => inter.filter((i) => i.pointerId !== e.pointerId));
          break;
      }
    },
    [],
  );

  const axisCb = useCallback(
    (idxX: number, idxY: number, e: React.PointerEvent, eventType: PointerEventType) => {
      const dim = e.currentTarget.getBoundingClientRect();
      const x = -(e.clientX - (dim.left + dim.right) / 2) / 30;
      const y = -(e.clientY - (dim.top + dim.bottom) / 2) / 30;
      const r = Math.min(Math.sqrt(x * x + y * y), 1);
      const ang = Math.atan2(y, x);
      const xa = r * Math.cos(ang);
      const ya = r * Math.sin(ang);

      switch (eventType) {
        case PointerEventType.Down:
          e.currentTarget.setPointerCapture(e.pointerId);
          setInteractions((inter) => [
            ...inter,
            {
              pointerId: e.pointerId,
              buttonIdx: -1,
              buttonVal: -1,
              axis1Idx: idxX,
              axis1Val: xa,
              axis2Idx: idxY,
              axis2Val: ya,
            },
          ]);
          break;
        case PointerEventType.Move:
          setInteractions((inter) =>
            inter.map((v) =>
              v.pointerId === e.pointerId
                ? { ...v, axis1Idx: idxX, axis1Val: xa, axis2Idx: idxY, axis2Val: ya }
                : v,
            ),
          );
          break;
        case PointerEventType.Up:
          setInteractions((inter) => inter.filter((i) => i.pointerId !== e.pointerId));
          break;
      }
    },
    [],
  );

  return {
    numButtons,
    numAxes,
    interactions,
    displayMapping,
    buttonCb,
    axisCb,
  };
};
