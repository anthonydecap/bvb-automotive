"use client";

import { useEffect, useRef } from "react";

/** Model names in a gold band: a steady drive, pushed faster and leaning with the scroll. */
export function Ticker({ names }: { names: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;
    const tick = () => {
      const el = track.current;
      if (el) {
        const y = window.scrollY;
        velocity += (y - lastY - velocity) * 0.2;
        lastY = y;
        x -= 1.2 + Math.min(40, Math.abs(velocity)) * 0.6;
        const half = el.scrollWidth / 2;
        if (-x > half) x += half;
        const skew = Math.max(-14, Math.min(14, -velocity * 0.35));
        el.style.transform = `translateX(${x}px) skewX(${skew}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!names.length) return null;
  const run = names.map((n, i) => (
    <span key={i}>
      {n} <i>/</i>
    </span>
  ));
  return (
    <div className="ticker" aria-hidden="true">
      <div ref={track} className="ticker-track speed">
        {run}
        {run}
      </div>
    </div>
  );
}
