"use client";

import { useEffect, useRef } from "react";

import type { CarSummary } from "@/lib/cars";

import { Img } from "./Img";

/** Cars that already left, in two lanes passing in opposite directions; scrolling pushes them along. */
export function Lanes({ cars }: { cars: Pick<CarSummary, "uid" | "href" | "title" | "model" | "image">[] }) {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const hover = useRef(false);

  useEffect(() => {
    const la = a.current;
    const lb = b.current;
    if (!la || !lb || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const touch = matchMedia("(pointer: coarse)").matches;
    let x = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;
    let wa = la.scrollWidth / 2;
    let wb = lb.scrollWidth / 2;
    const tick = () => {
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.2;
      lastY = y;
      x += (hover.current ? 0.15 : 0.6) + Math.min(touch ? 8 : 30, Math.abs(velocity)) * (touch ? 0.2 : 0.35);
      la.style.transform = `translate3d(${-(x % wa)}px,0,0)`;
      lb.style.transform = `translate3d(${(x % wb) - wb}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    // Only run while the lanes are on screen.
    const seen = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame);
      if (!e.isIntersecting) return;
      wa = la.scrollWidth / 2;
      wb = lb.scrollWidth / 2;
      lastY = window.scrollY;
      frame = requestAnimationFrame(tick);
    });
    seen.observe(la.parentElement ?? la);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const half = Math.ceil(cars.length / 2);
  const lane = (list: typeof cars, copy: number) =>
    list.map((c) => (
      <a
        key={`${c.uid}-${copy}`}
        href={c.href}
        className="past"
        tabIndex={copy ? -1 : undefined}
        aria-hidden={copy ? true : undefined}
      >
        <figure>
          <div className="past-photo">
            <Img field={c.image} alt={copy ? "" : c.title} fill sizes="24rem" className="object-cover" />
            <span>Verkocht</span>
          </div>
          <figcaption>{c.model}</figcaption>
        </figure>
      </a>
    ));

  return (
    <div
      className="lanes"
      onPointerEnter={(e) => e.pointerType === "mouse" && (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
    >
      <div ref={a} className="lane">
        {lane(cars.slice(0, half), 0)}
        {lane(cars.slice(0, half), 1)}
      </div>
      <div ref={b} className="lane">
        {lane(cars.slice(half), 0)}
        {lane(cars.slice(half), 1)}
      </div>
    </div>
  );
}
