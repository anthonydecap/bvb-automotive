"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Trip = { from: string; time: string; route: string };

/*
 * A schematic map of the region, projected from longitude and latitude
 * (x = (lon − 4.2) × 400, y = (51.40 − lat) × 640), with the motorways that lead to Geel.
 */
const PLACES: Record<string, [number, number]> = {
  antwerpen: [80, 115],
  hasselt: [456, 301],
  leuven: [200, 333],
  brussel: [60, 352],
  mechelen: [118, 222],
  turnhout: [300, 51],
  herentals: [252, 141],
  mol: [368, 134],
  westerlo: [288, 198],
  aarschot: [252, 262],
  diest: [348, 265],
  geel: [316, 154],
};
const BVB: [number, number] = [308, 166];

/** Motorways drawn on the map, as polylines through the places above. */
const ROADS: { name: string; points: [number, number][]; label: [number, number] }[] = [
  {
    name: "E313",
    points: [
      [80, 115],
      [170, 128],
      [252, 141],
      [298, 163],
      [360, 205],
      [420, 262],
      [456, 301],
    ],
    label: [395, 222],
  },
  {
    name: "E34",
    points: [
      [80, 115],
      [190, 92],
      [300, 51],
    ],
    label: [180, 84],
  },
  {
    name: "E19",
    points: [
      [60, 352],
      [96, 268],
      [118, 222],
      [92, 160],
      [80, 115],
    ],
    label: [70, 250],
  },
  {
    name: "E314",
    points: [
      [60, 352],
      [130, 344],
      [200, 333],
      [252, 262],
      [348, 265],
      [456, 301],
    ],
    label: [292, 255],
  },
  {
    name: "N19",
    points: [
      [252, 262],
      [288, 198],
      [304, 172],
      [316, 154],
    ],
    label: [268, 222],
  },
];

/** The road each trip takes, as points, ending at the showroom. */
const TRIPS: Record<string, [number, number][]> = {
  antwerpen: [[80, 115], [170, 128], [252, 141], [298, 163], BVB],
  hasselt: [[456, 301], [420, 262], [360, 205], [298, 163], BVB],
  leuven: [[200, 333], [252, 262], [288, 198], [304, 172], BVB],
  brussel: [[60, 352], [96, 268], [118, 222], [92, 160], [80, 115], [170, 128], [252, 141], [298, 163], BVB],
  mechelen: [[118, 222], [92, 160], [80, 115], [170, 128], [252, 141], [298, 163], BVB],
  turnhout: [[300, 51], [308, 110], BVB],
  herentals: [[252, 141], [298, 163], BVB],
  mol: [[368, 134], [330, 160], BVB],
  westerlo: [[288, 198], [304, 172], BVB],
};

const key = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]/g, "");
const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

/**
 * The way to the showroom. Pick a city (or let it cycle) and its route draws itself on the map,
 * a point drives it to Geel and the minutes count up as it arrives.
 */
export function RouteMap({ trips, inset }: { trips: Trip[]; inset?: ReactNode }) {
  const mapped = useMemo(() => trips.filter((t) => TRIPS[key(t.from)]), [trips]);
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [minutes, setMinutes] = useState<number | null>(null);
  const route = useRef<SVGPathElement>(null);
  const car = useRef<SVGGElement>(null);

  const trip = mapped[active];
  const total = parseInt(trip?.time ?? "", 10) || 0;

  const drive = useCallback(() => {
    const el = route.current;
    if (!el) return () => {};
    const length = el.getTotalLength();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.strokeDasharray = `${length}`;
    if (reduce) {
      el.style.strokeDashoffset = "0";
      const f = requestAnimationFrame(() => setMinutes(total));
      return () => cancelAnimationFrame(f);
    }
    let frame = 0;
    const t0 = performance.now();
    const duration = 1800;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      el.style.strokeDashoffset = `${length * (1 - e)}`;
      const pt = el.getPointAtLength(length * e);
      car.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      setMinutes(Math.round(total * e));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [total]);

  useEffect(() => drive(), [active, drive]);

  // Cycle through the cities until the visitor picks one.
  useEffect(() => {
    if (manual || mapped.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % mapped.length), 4200);
    return () => window.clearTimeout(t);
  }, [active, manual, mapped.length]);

  const pick = (i: number) => {
    setManual(true);
    setActive(i);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <ul className="grid gap-1" aria-label="Rijtijd naar de showroom">
          {trips.map((t) => {
            const i = mapped.indexOf(t);
            const on = i === active;
            return (
              <li key={t.from}>
                <button
                  type="button"
                  disabled={i < 0}
                  aria-pressed={on}
                  onMouseEnter={() => i >= 0 && pick(i)}
                  onFocus={() => i >= 0 && pick(i)}
                  onClick={() => i >= 0 && pick(i)}
                  className={`relative grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 px-5 py-4 text-left transition-colors ${
                    on ? "bg-navy-2" : "hover:bg-navy-2/60"
                  }`}
                >
                  {on && <span className="absolute inset-y-0 left-0 w-1 bg-gold" aria-hidden="true" />}
                  <span className="text-lead font-semibold">{t.from}</span>
                  <span className="tabular text-lead font-semibold text-gold">{t.time}</span>
                  {t.route && <span className="col-span-2 text-small text-mist">{t.route}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        {inset && <div className="mt-6">{inset}</div>}
      </div>

      <figure className="relative overflow-hidden bg-night lg:col-span-7">
        <svg
          viewBox="20 20 530 380"
          className="block h-auto w-full"
          role="img"
          aria-label={trip ? `Route vanuit ${trip.from}: ${trip.time}` : "Kaart"}
        >
          {/* motorways */}
          {ROADS.map((r) => (
            <g key={r.name}>
              <path
                d={path(r.points)}
                fill="none"
                stroke="#2b2d63"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x={r.label[0]} y={r.label[1]} fill="#7d80ad" fontSize="11" fontWeight="700">
                {r.name}
              </text>
            </g>
          ))}
          {/* the route of the active city */}
          {trip && (
            <path
              key={trip.from}
              ref={route}
              d={path(TRIPS[key(trip.from)])}
              fill="none"
              stroke="#cfae57"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* places */}
          {Object.entries(PLACES)
            .filter(([n]) => n !== "geel")
            .map(([n, [x, y]]) => {
              const on = trip && key(trip.from) === n;
              return (
                <g key={n}>
                  <circle cx={x} cy={y} r={on ? 6 : 4} fill={on ? "#cfae57" : "#b3b5cf"} />
                  <text
                    x={x + 9}
                    y={y + 4}
                    fill={on ? "#f5f4ef" : "#b3b5cf"}
                    fontSize={on ? 15 : 12}
                    fontWeight={on ? 700 : 500}
                  >
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                  </text>
                </g>
              );
            })}
          {/* the moving car */}
          {trip && (
            <g ref={car} transform={`translate(${TRIPS[key(trip.from)][0].join(" ")})`}>
              <circle r="9" fill="#cfae57" opacity="0.25" />
              <circle r="5" fill="#f5f4ef" />
            </g>
          )}
          {/* the showroom */}
          <g transform={`translate(${BVB[0]} ${BVB[1]})`}>
            <circle r="14" fill="none" stroke="#cfae57" strokeWidth="2" className="route-ping" />
            <circle r="7" fill="#cfae57" />
            <text x="14" y="-12" fill="#f5f4ef" fontSize="15" fontWeight="800" fontStyle="italic">
              BVB, Geel
            </text>
          </g>
        </svg>

        {trip && (
          <figcaption
            className="absolute top-5 left-5 flex flex-col-reverse bg-night/90 px-4 py-3"
            aria-live="polite"
          >
            <span className="mt-1 block text-small text-mist">vanuit {trip.from}</span>
            <span className="tabular block text-[clamp(1.75rem,1.2rem+1.6cqw,2.75rem)] leading-none font-extrabold text-gold italic [font-stretch:120%]">
              {minutes ?? total} min
            </span>
          </figcaption>
        )}
      </figure>
    </div>
  );
}
