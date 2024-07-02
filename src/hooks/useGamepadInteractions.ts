import { useState, useEffect, useCallback } from "react";

import * as types from "../types";

export function useGamepadInteractions(
  displayMapping: types.DisplayMapping,
  cbInteractChange: (joy: types.Joy) => void,
): {
  numButtons: number;
  numAxes: number;
  interactions: types.Interaction[];
  handleButtonInteraction: types.ButtonInteractionHandler;
  handleAxisInteraction: types.AxisInteractionHandler;
} {
  const [numButtons, setNumButtons] = useState<number>(0);
  const [numAxes, setNumAxes] = useState<number>(0);
  const [interactions, setInteractions] = useState<types.Interaction[]>([]);

  useEffect(() => {
    if (displayMapping.length === 0) {
      setNumButtons(0);
      setNumAxes(0);
    } else {
      const buttonConfigs = displayMapping.filter(
        (item) => item.type === "button",
      ) as types.ButtonConfig[];
      const numberOfButtons = buttonConfigs.length;

      setNumButtons(numberOfButtons);

      setNumAxes(
        displayMapping.reduce((tempMax, current) => {
          if (current.type === "stick") {
            const stick = current as types.StickConfig;
            return Math.max(tempMax, stick.axisX, stick.axisY);
          } else {
            return tempMax;
          }
        }, -1) + 1,
      );
    }
  }, [displayMapping]);

  useEffect(() => {
    if (numButtons === 0 || numAxes === 0) {
      return;
    }
    const tmpJoy = {
      header: {
        frame_id: "",
        stamp: { sec: 0, nsec: 0 },
      },
      buttons: Array<number>(numButtons).fill(0),
      axes: Array<number>(numAxes).fill(0),
    } as types.Joy;

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

  const handleButtonInteraction = useCallback(
    (idx: number, e: React.PointerEvent, eventType: types.PointerEventType) => {
      switch (eventType) {
        case types.PointerEventType.Down: {
          e.currentTarget.setPointerCapture(e.pointerId);
          setInteractions((prev) => [
            ...prev,
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
        }
        case types.PointerEventType.Up: {
          setInteractions((prev) => prev.filter((i) => i.pointerId !== e.pointerId));
          break;
        }
        default:
          break;
      }
    },
    [],
  );

  const handleAxisInteraction = useCallback(
    (idxX: number, idxY: number, e: React.PointerEvent, eventType: types.PointerEventType) => {
      const dim = e.currentTarget.getBoundingClientRect();
      const x = -(e.clientX - (dim.left + dim.right) / 2) / 30;
      const y = -(e.clientY - (dim.top + dim.bottom) / 2) / 30;
      const r = Math.min(Math.sqrt(x * x + y * y), 1);
      const ang = Math.atan2(y, x);
      const xa = r * Math.cos(ang);
      const ya = r * Math.sin(ang);

      switch (eventType) {
        case types.PointerEventType.Down: {
          e.currentTarget.setPointerCapture(e.pointerId);
          setInteractions((prev) => [
            ...prev,
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
        }
        case types.PointerEventType.Move: {
          setInteractions((prev) =>
            prev.map((v) =>
              v.pointerId === e.pointerId
                ? {
                    pointerId: e.pointerId,
                    buttonIdx: -1,
                    buttonVal: -1,
                    axis1Idx: idxX,
                    axis1Val: xa,
                    axis2Idx: idxY,
                    axis2Val: ya,
                  }
                : v,
            ),
          );
          break;
        }
        case types.PointerEventType.Up: {
          setInteractions((prev) => prev.filter((i) => i.pointerId !== e.pointerId));
          break;
        }
      }
    },
    [],
  );

  return { numButtons, numAxes, interactions, handleButtonInteraction, handleAxisInteraction };
}
