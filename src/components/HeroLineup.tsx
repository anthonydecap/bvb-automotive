"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

import type { CarSummary } from "@/lib/cars";
import { formatKm, formatPrice } from "@/lib/format";

import { Img } from "./Img";

type HeroLineupProps = {
  cars: CarSummary[];
  /** Headline, supporting sentence and action, rendered on the server. */
  intro: ReactNode;
  /** Short facts set beside the headline. */
  aside?: ReactNode;
};

/**
 * The first screen. The cars standing on the lot right now, in a row the visitor drags; the one in the
 * middle comes forward and the whole screen takes on its factory paint. Without script it is a plain
 * scrolling row on the paint of the first car.
 */
export function HeroLineup({ cars, intro, aside }: HeroLineupProps) {
  const row = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const paint = cars[current]?.paint;

  const layout = useCallback(() => {
    const el = row.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>("[data-item]")];
    const centre = el.scrollLeft + el.clientWidth / 2;
    const step = items[1] ? items[1].offsetLeft - items[0].offsetLeft : el.clientWidth;
    let nearest = 0;
    let best = Infinity;
    items.forEach((item, i) => {
      const offset = (item.offsetLeft + item.offsetWidth / 2 - centre) / step;
      const d = Math.min(Math.abs(offset), 3);
      if (Math.abs(offset) < best) {
        best = Math.abs(offset);
        nearest = i;
      }
      item.style.setProperty("--d", d.toFixed(3));
      item.style.zIndex = String(10 - Math.round(d * 2));
    });
    setCurrent(nearest);
  }, []);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    // Start with the first car in the middle.
    el.dataset.ready = "";
    layout();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [layout]);

  const bringForward = (i: number) => (event: MouseEvent) => {
    if (i === current) return;
    event.preventDefault();
    const el = row.current;
    const item = el?.querySelectorAll<HTMLElement>("[data-item]")[i];
    if (!el || !item) return;
    el.scrollTo({ left: item.offsetLeft + item.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  };

  const now = cars[current];

  return (
    <section
      data-slice-type="hero"
      className={`relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-10 transition-[background-color,color] duration-500 lg:pt-32 ${
        paint?.light ? "text-ink" : "text-chalk"
      }`}
      style={{ backgroundColor: paint?.hex ?? "var(--color-ink)" }}
    >
      <div className="frame grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-8">{intro}</div>
        {aside && <div className="hidden lg:col-span-3 lg:col-start-10 lg:block">{aside}</div>}
      </div>

      <div className="mt-auto pt-10">
        <div
          ref={row}
          tabIndex={0}
          role="region"
          aria-label="Wagens die nu in de showroom staan"
          className="no-scrollbar flex snap-x snap-mandatory items-center overflow-x-auto px-[calc(50%-min(36vw,34rem)/2)] py-6 focus-visible:outline-offset-[-4px] max-sm:px-[14vw] [--w:72vw] sm:[--w:min(36vw,34rem)]"
        >
          {cars.map((car, i) => (
            <Link
              key={car.uid}
              href={car.href}
              data-item
              onClick={bringForward(i)}
              aria-label={`${car.title}, ${car.price ? formatPrice(car.price) : "prijs op aanvraag"}`}
              className="relative aspect-[3/2] w-[var(--w)] shrink-0 snap-center overflow-hidden bg-graphite transition-[transform,filter] duration-300 ease-out [--d:0] [transform:scale(calc(1-var(--d)*0.3))_translateY(calc(var(--d)*var(--d)*0.9rem))] [filter:brightness(calc(1-var(--d)*0.25))] sm:-mx-[1.5vw]"
              style={{ zIndex: 10 - i * 2 } as CSSProperties}
            >
              <Img field={car.image} alt="" fill priority={i < 3} sizes="(min-width: 640px) 36vw, 72vw" className="object-cover" />
            </Link>
          ))}
        </div>

        {now && (
          <div className="frame mt-2 text-center" aria-live="polite">
            <p className="text-lead font-semibold">{now.title}</p>
            <p className="tabular mt-1 text-body">
              {[now.price ? formatPrice(now.price) : "Prijs op aanvraag", now.year, now.mileage ? formatKm(now.mileage) : null, now.paint.name]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
