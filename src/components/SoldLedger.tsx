"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { CarSummary } from "@/lib/cars";
import { formatNumber } from "@/lib/format";

import { Img } from "./Img";

type Group = {
  model: string;
  count: number;
  href: string;
  image: CarSummary["image"];
  years: string;
  km: string;
};

const range = (values: number[], format: (n: number) => string) => {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? format(min) : `${format(min)}–${format(max)}`;
};

/** Sold cars grouped by model, most sold first; each group links to its latest car. */
function groupByModel(cars: CarSummary[]): Group[] {
  const map = new Map<string, CarSummary[]>();
  for (const car of cars) {
    const key = car.model || car.title;
    map.set(key, [...(map.get(key) ?? []), car]);
  }
  return [...map.entries()]
    .map(([model, list]) => ({
      model,
      count: list.length,
      href: list[0].href,
      image: (list.find((c) => c.image?.url) ?? list[0]).image,
      years: range(
        list.map((c) => c.year).filter((n): n is number => !!n),
        String,
      ),
      km: range(
        list.map((c) => c.mileage).filter((n): n is number => !!n),
        (n) => formatNumber(Math.round(n / 500) * 500),
      ),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * The record of what left the lot. Model names pass one by one across a picture held at the centre
 * of the screen; the picture and the two facts beside it follow the name crossing the middle.
 */
export function SoldLedger({ cars, title = "Al vertrokken" }: { cars: CarSummary[]; title?: string }) {
  const groups = useMemo(() => groupByModel(cars), [cars]);
  const [current, setCurrent] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-index]");
    if (!items?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-49% 0px -49% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [groups]);

  if (!groups.length) return null;
  const total = cars.length;
  const facts = (g: Group) =>
    [`${g.count}× verkocht`, g.years, g.km && `${g.km} km`].filter(Boolean).join(", ");

  return (
    <div className="relative bg-ink py-[max(18svh,calc(var(--s)/2+2rem))] text-chalk [--s:62vw] md:[--s:min(31vw,28rem)]">
      {/* The held picture: a zero-height anchor pinned at mid-screen, the picture centred on it,
          so it never runs past the panel. It sits under the names, which cross it. */}
      <div className="sticky top-[50svh] z-0 h-0" aria-hidden="true">
        <div className="absolute left-1/2 size-[var(--s)] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-graphite">
          {groups.map((g, i) => (
            <div
              key={g.model}
              className={`absolute inset-0 transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              <Img
                field={g.image}
                alt=""
                fill
                sizes="(min-width: 768px) 31vw, 62vw"
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-ink/50" />
        </div>
      </div>

      <h3 className="display relative z-10 mx-auto max-w-[14ch] px-[var(--margin)] text-center text-display text-mist">
        {title}
      </h3>
      <ol ref={list} className="relative z-10 mt-[4svh] px-[var(--margin)] text-center">
        {groups.map((g, i) => (
          <li key={g.model} data-index={i} className="py-3 sm:py-[2.5svh]">
            <Link
              href={g.href}
              className={`group block transition-colors duration-300 hover:text-gold ${
                i === current ? "text-chalk" : "text-mist"
              }`}
            >
              <span className="display block text-balance text-head sm:text-display">{g.model}</span>
              <span className="mt-2 block text-small sm:mt-3 sm:text-body">{facts(g)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="relative z-10 mt-[6svh] px-[var(--margin)] text-center text-lead text-fog">
        {total} wagens, {groups.length} modellen. Elke verkochte wagen houdt zijn eigen pagina.
      </p>
    </div>
  );
}
