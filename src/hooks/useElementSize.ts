import { useEffect, useRef, useState } from 'react';

export interface Size {
  w: number;
  h: number;
}

/** Observe an element's content-box size with a stable ref. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (width: number, height: number) => {
      setSize((prev) =>
        Math.abs(prev.w - width) < 0.5 && Math.abs(prev.h - height) < 0.5 ? prev : { w: width, h: height },
      );
    };

    // synchronous first measurement so the first paint already has a size,
    // even if the observer callback is delayed
    const box = el.getBoundingClientRect();
    if (box.width > 0 && box.height > 0) apply(box.width, box.height);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      apply(width, height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}
