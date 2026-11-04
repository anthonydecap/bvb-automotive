import { formatKm } from "@/lib/format";

import data from "./cars.json";
import { document, img, rt } from "./helpers";

/**
 * Cars imported from the old WooCommerce shop (src/seed/cars.json). Cars that
 * were still for sale keep every photo; sold cars keep their first eight.
 */

type SeedCar = (typeof data)[number];

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function description(car: SeedCar) {
  const title = `${car.brand} ${car.model}`;
  const first = [
    `Deze ${title}`,
    car.year ? ` uit ${car.year}` : "",
    car.mileage ? ` heeft ${formatKm(car.mileage)} op de teller` : "",
    car.color
      ? `${car.mileage ? " en" : ""} is uitgevoerd in ${car.color.replace(/^(\w+) \((.+)\)$/, "$2 ($1)").replace(/\((\w)/, (_, c) => `(${c.toLowerCase()}`)}`
      : "",
    ".",
  ].join("");

  const tech = [
    car.power_hp ? `${car.power_hp} pk${car.power_kw ? ` (${car.power_kw} kW)` : ""}` : null,
    car.gearbox ? `een ${car.gearbox}-versnellingsbak` : null,
    car.drivetrain ? lower(car.drivetrain) : null,
  ].filter(Boolean);
  const second = tech.length
    ? `${tech.slice(0, -1).join(", ")}${tech.length > 1 ? " en " : ""}${tech.at(-1)}.`.replace(/^./, (c) =>
        c.toUpperCase(),
      )
    : null;

  const facts = [
    car.accident_free ? "100% ongevalvrij" : null,
    car.first_owner ? "eerste eigenaar" : null,
    car.vat.startsWith("BTW") ? "btw-wagen, dus de btw is aftrekbaar" : "margewagen, btw niet aftrekbaar",
  ].filter(Boolean) as string[];
  const third = `${facts.join(", ").replace(/^./, (c) => c.toUpperCase())}.`;

  return rt(
    first,
    ...(second ? [second] : []),
    third,
    "Zoals elke wagen in ons aanbod is hij motorisch en cosmetisch in topstaat. Op aanvraag geven we de lak een grondige correctie en beschermen we hem met een keramische Gyeon-coating.",
  );
}

const day = 24 * 60 * 60 * 1000;
const newest = new Date("2026-11-01T09:00:00Z").getTime();

export const carDocuments = data.map((car, i) => {
  const title = `${car.brand} ${car.model}`;
  return document(
    "car",
    car.uid,
    {
      brand: car.brand,
      model: car.model,
      highlights: car.highlights || null,
      status: car.status,
      price: car.price,
      vat: car.vat,
      featured: car.featured,
      premium: car.premium,
      gallery: car.images.map((image, n) => ({
        image: img(image.url, `${title}, foto ${n + 1}`, image.size as [number, number]),
      })),
      description: description(car),
      year: car.year,
      first_registration: car.first_registration,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      gearbox: car.gearbox,
      power_hp: car.power_hp,
      power_kw: car.power_kw,
      engine_cc: car.engine_cc,
      drivetrain: car.drivetrain,
      euronorm: car.euronorm,
      color: car.color,
      interior: car.interior,
      doors: car.doors,
      seats: car.seats,
      warranty: car.warranty,
      accident_free: car.accident_free,
      first_owner: car.first_owner,
      carpass: true,
      options: rt(...car.options.map((o) => `- ${o}`)),
      extras: rt(...car.extras),
      autoscout_url: { link_type: "Any" },
      meta_title: null,
      meta_description: null,
      meta_image: {},
    },
    new Date(newest - i * day).toISOString().replace("Z", "+0000"),
  );
});
