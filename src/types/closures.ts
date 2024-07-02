import { PointerEventType } from "./gamepad";

export type ButtonInteractionHandler = (
  idx: number,
  e: React.PointerEvent,
  eventType: PointerEventType,
) => void;

export type AxisInteractionHandler = (
  idxX: number,
  idxY: number,
  e: React.PointerEvent,
  eventType: PointerEventType,
) => void;
