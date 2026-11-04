import Link from "next/link";
import type { CSSProperties } from "react";

import type { CarSummary } from "@/lib/cars";
import { formatKm, formatPrice } from "@/lib/format";

import { Img } from "./Img";

type CarCardProps = {
  car: CarSummary;
  dark?: boolean;
  priority?: boolean;
  /** A double tile in the catalogue. */
  large?: boolean;
};

/** The facts under a tile: year, kilometres and the paint the car is mounted on. */
export function carFacts(car: CarSummary) {
  return [
    car.year ? String(car.year) : null,
    car.mileage ? formatKm(car.mileage) : null,
    car.paint.name || null,
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * A specimen: the car as photographed on the lot, mounted on a field of its own factory paint.
 * Name, price and facts sit under the tile, never on it.
 */
export function CarCard({ car, dark, priority, large }: CarCardProps) {
  const sold = car.status === "Verkocht";
  const muted = dark ? "text-mist" : "text-stone";
  const price = sold ? "Verkocht" : car.price ? formatPrice(car.price) : "Op aanvraag";

  return (
    <Link href={car.href} className="group relative block">
      <div className="specimen" style={{ "--paint": car.paint.hex } as CSSProperties}>
        <div className="specimen-photo">
          <Img
            field={car.image}
            alt={car.title}
            fill
            priority={priority}
            sizes={
              large
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            }
            className={`object-cover ${sold ? "grayscale-[0.5]" : ""}`}
          />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className={`${large ? "text-lead" : "text-body"} leading-tight font-semibold`}>
          <span className="sr-only">{car.brand} </span>
          {car.model}
        </h3>
        <p
          className={`tabular shrink-0 ${large ? "text-lead" : "text-body"} font-semibold ${sold ? muted : ""}`}
        >
          {price}
        </p>
      </div>
      <p className={`mt-1 text-small ${muted}`}>
        {car.status === "Gereserveerd" ? "Gereserveerd, " : ""}
        {carFacts(car)}
      </p>
    </Link>
  );
}
