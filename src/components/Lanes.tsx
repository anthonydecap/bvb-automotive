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
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;
    const tick = () => {
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.2;
      lastY = y;
      x += (hover.current ? 0.15 : 0.6) + Math.min(30, Math.abs(velocity)) * 0.35;
      if (a.current && b.current) {
        const wa = a.current.scrollWidth / 2;
        const wb = b.current.scrollWidth / 2;
        a.current.style.transform = `translateX(${-(x % wa)}px)`;
        b.current.style.transform = `translateX(${(x % wb) - wb}px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
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
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
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
