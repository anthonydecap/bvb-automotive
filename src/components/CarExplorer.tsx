"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { CarSummary } from "@/lib/cars";

import { CarCard } from "./CarCard";
import { Close, Sliders } from "./Icons";
import { Lanes } from "./Lanes";

type CarExplorerProps = {
  cars: CarSummary[];
  showFilters: boolean;
  showSold: boolean;
  dark?: boolean;
  contactHref?: string;
};

const priceRanges = [
  { id: "tot-25k", label: "Tot € 25.000", min: 0, max: 25000 },
  { id: "25k-35k", label: "€ 25.000 – 35.000", min: 25000, max: 35000 },
  { id: "35k-45k", label: "€ 35.000 – 45.000", min: 35000, max: 45000 },
  { id: "45k-plus", label: "Vanaf € 45.000", min: 45000, max: Infinity },
];

const sorts = [
  { id: "aanbevolen", label: "Aanbevolen" },
  { id: "prijs-laag", label: "Prijs: laag naar hoog" },
  { id: "prijs-hoog", label: "Prijs: hoog naar laag" },
  { id: "bouwjaar", label: "Bouwjaar: nieuwste eerst" },
  { id: "km", label: "Kilometerstand: laagste eerst" },
];

type Filters = { merk: string; brandstof: string; transmissie: string; prijs: string; sorteer: string };
const empty: Filters = { merk: "", brandstof: "", transmissie: "", prijs: "", sorteer: "aanbevolen" };

const unique = (values: (string | null)[]) =>
  [...new Set(values.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b, "nl"));

function sortBy(cars: CarSummary[], sort: string) {
  const list = [...cars];
  const num = (n: number | null, fallback: number) => n ?? fallback;
  if (sort === "prijs-laag") list.sort((a, b) => num(a.price, Infinity) - num(b.price, Infinity));
  if (sort === "prijs-hoog") list.sort((a, b) => num(b.price, -1) - num(a.price, -1));
  if (sort === "bouwjaar") list.sort((a, b) => num(b.year, 0) - num(a.year, 0));
  if (sort === "km") list.sort((a, b) => num(a.mileage, Infinity) - num(b.mileage, Infinity));
  return list;
}

/** Car grid with optional filters. Filter state is kept in the URL so results can be shared. */
export function CarExplorer({ cars, showFilters, showSold, contactHref = "/contact" }: CarExplorerProps) {
  const [filters, setFilters] = useState<Filters>(empty);
  const [panelOpen, setPanelOpen] = useState(false);

  // Read filters from the URL once, after hydration.
  useEffect(() => {
    if (!showFilters) return;
    const params = new URLSearchParams(window.location.search);
    const next = { ...empty };
    for (const key of Object.keys(empty) as (keyof Filters)[]) next[key] = params.get(key) ?? empty[key];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
    setFilters(next);
  }, [showFilters]);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next))
      if (value && value !== empty[key as keyof Filters]) params.set(key, value);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  };

  const options = useMemo(
    () => ({
      merk: unique(cars.map((c) => c.brand)),
      brandstof: unique(cars.map((c) => c.fuel)),
      transmissie: unique(cars.map((c) => c.transmission)),
    }),
    [cars],
  );

  const filtered = useMemo(() => {
    const range = priceRanges.find((r) => r.id === filters.prijs);
    return cars.filter(
      (c) =>
        (!filters.merk || c.brand === filters.merk) &&
        (!filters.brandstof || c.fuel === filters.brandstof) &&
        (!filters.transmissie || c.transmission === filters.transmissie) &&
        (!range || (c.price !== null && c.price >= range.min && c.price < range.max)),
    );
  }, [cars, filters]);

  const forSale = sortBy(
    filtered.filter((c) => c.status !== "Verkocht"),
    filters.sorteer,
  );
  const sold = showSold ? filtered.filter((c) => c.status === "Verkocht") : [];
  const active = (Object.keys(empty) as (keyof Filters)[]).filter(
    (k) => k !== "sorteer" && filters[k],
  ).length;

  const select = "field h-14 appearance-none bg-no-repeat pt-5 pr-10 font-medium";
  const chevron = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23888' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 1rem center",
  };
  const label = "pointer-events-none absolute top-2 left-4 text-small text-mist";
  // One double tile in every seven, once the stock is large enough to carry it.

  return (
    <div>
      {showFilters && (
        <div className="mb-12">
          <div className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] sm:mx-0 sm:flex-wrap sm:px-0">
            {["", ...options.merk].map((brand) => {
              const on = filters.merk === brand;
              const count = cars.filter(
                (c) => (!brand || c.brand === brand) && c.status !== "Verkocht",
              ).length;
              return (
                <button
                  key={brand || "alle"}
                  type="button"
                  onClick={() => update({ merk: brand })}
                  aria-pressed={on}
                  className={`flex h-12 shrink-0 items-center gap-2 px-5 font-medium transition-colors ${
                    on ? "bg-gold text-night" : "bg-navy text-chalk hover:bg-navy-2"
                  }`}
                >
                  {brand || "Alle merken"}
                  <span className="tabular text-small opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 lg:hidden">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setPanelOpen(!panelOpen)}
              aria-expanded={panelOpen}
              aria-controls="car-filters"
            >
              <Sliders size={18} /> Filters{active ? ` (${active})` : ""}
            </button>
            <p className="tabular text-small text-mist" aria-live="polite">
              {forSale.length} {forSale.length === 1 ? "wagen" : "wagens"}
            </p>
          </div>

          <div
            id="car-filters"
            className={`mt-4 gap-2 sm:grid-cols-2 lg:grid lg:grid-cols-5 ${panelOpen ? "grid" : "hidden"}`}
          >
            <label className="relative block">
              <span className={label}>Prijs</span>
              <select
                className={select}
                style={chevron}
                value={filters.prijs}
                onChange={(e) => update({ prijs: e.target.value })}
              >
                <option value="">Alle prijzen</option>
                {priceRanges.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative block">
              <span className={label}>Brandstof</span>
              <select
                className={select}
                style={chevron}
                value={filters.brandstof}
                onChange={(e) => update({ brandstof: e.target.value })}
              >
                <option value="">Alle brandstoffen</option>
                {options.brandstof.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="relative block">
              <span className={label}>Transmissie</span>
              <select
                className={select}
                style={chevron}
                value={filters.transmissie}
                onChange={(e) => update({ transmissie: e.target.value })}
              >
                <option value="">Automaat en manueel</option>
                {options.transmissie.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="relative block">
              <span className={label}>Sorteren</span>
              <select
                className={select}
                style={chevron}
                value={filters.sorteer}
                onChange={(e) => update({ sorteer: e.target.value })}
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => update({ ...empty })}
              disabled={!active && filters.sorteer === empty.sorteer}
              className="btn btn-ghost h-14 w-full disabled:pointer-events-none disabled:opacity-40"
            >
              <Close size={16} /> Wis filters
            </button>
          </div>

          <p className="tabular mt-5 hidden text-small text-mist lg:block" aria-live="polite">
            {forSale.length} {forSale.length === 1 ? "wagen" : "wagens"} beschikbaar
            {active ? " met deze filters" : ""}
          </p>
        </div>
      )}

      {forSale.length > 0 ? (
        <ul className="grid-cars grid gap-x-[clamp(0.75rem,1.5cqw,1.5rem)] gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {forSale.map((car, i) => (
            <li key={car.uid}>
              <CarCard
                car={car}
                priority={i < 2}
                sizes="(min-width: 1920px) 634px, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 92vw"
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-navy p-8 sm:p-12">
          <p className="speed text-[clamp(1.5rem,1rem+1.4cqw,2.25rem)]">
            {active
              ? "Geen beschikbare wagens met deze filters."
              : "Alle wagens uit deze selectie zijn verkocht."}
          </p>
          <p className="mt-4 max-w-xl text-mist">
            Elke week komen er nieuwe wagens binnen. Zoekt u iets specifieks, dan gaan we ook op zoek of
            importeren we op aanvraag.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={contactHref} className="btn btn-gold">
              Laat ons zoeken
            </Link>
            {active > 0 && (
              <button type="button" className="link font-medium" onClick={() => update({ ...empty })}>
                Wis filters
              </button>
            )}
          </div>
        </div>
      )}

      {sold.length > 0 && (
        <div className="mt-[var(--section)] overflow-hidden">
          <div className="sec-head">
            <h2 className="speed head">Sleutels overhandigd</h2>
            <p className="lead text-mist">
              Deze wagens stonden ooit in onze showroom in Geel. Vandaag rijden ze bij een nieuwe eigenaar.
            </p>
          </div>
          <Lanes cars={sold} />
        </div>
      )}
    </div>
  );
}
