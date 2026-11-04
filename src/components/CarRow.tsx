"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

import type { CarSummary } from "@/lib/cars";

import { Arrow } from "./Icons";
import { CarCard } from "./CarCard";

/** The stock as a row to drag (mouse) or swipe (touch), ending on an invitation to see everything. */
export function CarRow({ cars, end, moreHref }: { cars: CarSummary[]; end?: ReactNode; moreHref?: string }) {
  const row = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !row.current) return;
    drag.current = { down: true, x: e.clientX, left: row.current.scrollLeft, moved: 0 };
    row.current.classList.add("dragging");
    const move = (ev: PointerEvent) => {
      if (!drag.current.down || !row.current) return;
      drag.current.moved = Math.abs(ev.clientX - drag.current.x);
      row.current.scrollLeft = drag.current.left - (ev.clientX - drag.current.x) * 1.4;
    };
    const up = () => {
      drag.current.down = false;
      row.current?.classList.remove("dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div
      ref={row}
      className="row"
      tabIndex={0}
      role="region"
      aria-label="Wagens in de showroom, sleep of scroll opzij"
      onPointerDown={onDown}
      onClickCapture={(e) => {
        if (drag.current.moved > 6) e.preventDefault();
      }}
    >
      {cars.map((car, i) => (
        <CarCard key={car.uid} car={car} priority={i < 2} />
      ))}
      <div className="row-end">
        {end}
        {moreHref && (
          <Link href={moreHref} className="btn btn-gold self-start">
            Volledig aanbod <Arrow />
          </Link>
        )}
      </div>
    </div>
  );
}
