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
      years: range(list.map((c) => c.year).filter((n): n is number => !!n), String),
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
  const now = groups[current] ?? groups[0];
  const total = cars.length;

  return (
    <div className="relative bg-ink py-[22svh] text-chalk [--s:60vw] md:[--s:min(31vw,28rem)]">
      {/* The held picture. It sits under the names, which cross it. */}
      <div
        className="sticky top-[calc(50svh-var(--s)/2)] z-0 -mb-[var(--s)] flex h-[var(--s)] justify-center"
        aria-hidden="true"
      >
        <div className="relative size-[var(--s)] overflow-hidden bg-graphite">
          {groups.map((g, i) => (
            <div
              key={g.model}
              className={`absolute inset-0 transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              <Img field={g.image} alt="" fill sizes="(min-width: 768px) 31vw, 60vw" className="object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-ink/45" />
        </div>
        <p className="absolute top-1/2 right-[calc(50%+var(--s)/2+3rem)] hidden -translate-y-1/2 text-right text-body md:block">
          {now.count}× verkocht
        </p>
        <p className="absolute top-1/2 left-[calc(50%+var(--s)/2+3rem)] hidden -translate-y-1/2 text-body md:block">
          {[now.years, now.km && `${now.km} km`].filter(Boolean).join(", ")}
        </p>
        <p className="absolute top-full mt-4 w-full text-center text-body md:hidden">
          {now.count}× verkocht{now.years ? `, ${now.years}` : ""}
        </p>
      </div>

      <ol ref={list} className="relative z-10 text-center">
        <li className="py-[2.5svh]">
          <h3 className="mx-auto max-w-[16ch] text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] font-bold tracking-[-0.035em] text-mist">
            {title}
          </h3>
          <p className="mt-6 text-body text-fog">
            {total} wagens, {groups.length} modellen
          </p>
        </li>
        {groups.map((g, i) => (
          <li key={g.model} data-index={i} className="py-[2.5svh]">
            <Link
              href={g.href}
              className={`mx-auto block max-w-[18ch] text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] font-bold tracking-[-0.035em] transition-colors duration-300 hover:text-gold ${
                i === current ? "text-chalk" : "text-mist"
              }`}
            >
              {g.model}
              <span className="sr-only">, {g.count}× verkocht</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
