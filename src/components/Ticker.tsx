"use client";

import { useEffect, useRef } from "react";

/** Model names in a gold band: a steady drive, pushed faster and leaning with the scroll. */
export function Ticker({ names }: { names: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch scrolling reports an uneven speed, so on a phone the band drives steadily and does not lean.
    const touch = matchMedia("(pointer: coarse)").matches;
    let x = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;
    let half = el.scrollWidth / 2;
    const tick = () => {
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.2;
      lastY = y;
      x -= 1.2 + Math.min(touch ? 12 : 40, Math.abs(velocity)) * (touch ? 0.25 : 0.6);
      if (-x > half) x += half;
      const skew = touch ? 0 : Math.max(-14, Math.min(14, -velocity * 0.35));
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      frame = requestAnimationFrame(tick);
    };
    // Only run while the band is on screen.
    const seen = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame);
      if (!e.isIntersecting) return;
      half = el.scrollWidth / 2;
      lastY = window.scrollY;
      frame = requestAnimationFrame(tick);
    });
    seen.observe(el.parentElement ?? el);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
    };
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
