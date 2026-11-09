import Link from "next/link";

import type { CarSummary } from "@/lib/cars";
import { formatNumber, formatPrice } from "@/lib/format";

import { Img } from "./Img";

type CarCardProps = {
  car: CarSummary;
  dark?: boolean;
  priority?: boolean;
  large?: boolean;
  sizes?: string;
};

/** A car: the photograph with its paint as a tag, name and price, then the numbers like a dashboard. */
export function CarCard({
  car,
  priority,
  sizes = "(min-width: 1920px) 1152px, (min-width: 1024px) 60vw, 84vw",
}: CarCardProps) {
  const sold = car.status === "Verkocht";
  const dash = [
    car.powerHp ? { v: String(car.powerHp), l: "pk" } : null,
    car.mileage ? { v: formatNumber(car.mileage), l: "km" } : null,
    car.year ? { v: String(car.year), l: "bouwjaar" } : null,
    car.transmission ? { v: car.transmission === "Automaat" ? "Auto" : "Manueel", l: "transmissie" } : null,
  ].filter((d): d is { v: string; l: string } => !!d);

  return (
    <Link href={car.href} className="car group" draggable={false}>
      <div className="car-photo">
        <Img
          field={car.image}
          alt={car.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
        {sold ? (
          <span className="tag sold">Verkocht</span>
        ) : car.status === "Gereserveerd" ? (
          <span className="tag sold">Gereserveerd</span>
        ) : (
          car.paint.name && <span className="tag">{car.paint.name}</span>
        )}
      </div>
      <div className="car-name">
        <h3 className="speed">
          <span className="sr-only">{car.brand} </span>
          {car.model}
        </h3>
        <p className="speed price">
          {sold ? "Verkocht" : car.price ? formatPrice(car.price) : "Op aanvraag"}
        </p>
      </div>
      {dash.length > 0 && (
        <dl className="dash">
          {dash.map((d) => (
            <div key={d.l}>
              <dt>{d.l}</dt>
              <dd>
                <b>{d.v}</b>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Link>
  );
}
