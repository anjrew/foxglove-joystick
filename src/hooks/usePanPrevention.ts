import { useEffect, useCallback } from 'react';

export function usePanPrevention() {
  const preventPan = useCallback((event: Event): void => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const elements = document.getElementsByClassName("preventPan");
    Array.prototype.forEach.call(elements, (el: HTMLElement) => {
      el.addEventListener("touchstart", preventPan, { passive: false });
      el.addEventListener("touchend", preventPan, { passive: false });
      el.addEventListener("touchmove", preventPan, { passive: false });
      el.addEventListener("touchcancel", preventPan, { passive: false });
    });

    return () => {
      Array.prototype.forEach.call(elements, (el: HTMLElement) => {
        el.removeEventListener("touchstart", preventPan);
        el.removeEventListener("touchend", preventPan);
        el.removeEventListener("touchmove", preventPan);
        el.removeEventListener("touchcancel", preventPan);
      });
    };
  }, [preventPan]);
}