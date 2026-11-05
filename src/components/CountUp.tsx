"use client";

import { useEffect, useRef } from "react";

/** A figure such as "4,5", "100+" or "20 min" that counts up once when it comes into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!el || !match || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, before, digits, after] = match;
    const decimals = digits.includes(",") || digits.includes(".") ? digits.split(/[.,]/)[1].length : 0;
    const target = parseFloat(digits.replace(",", "."));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          const v = target * (1 - Math.pow(1 - p, 4));
          el.textContent =
            before +
            v.toLocaleString("nl-BE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
            after;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
