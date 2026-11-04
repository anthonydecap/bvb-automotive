import type { Content, ImageField } from "@prismicio/client";

import { type Paint, paintOf } from "./paint";
import { carPath } from "./routes";

export type Car = Content.CarDocument;
export type Collection = "VAG" | "BMW & Mini" | "Premium & Performance";

const VAG = new Set(["Volkswagen", "Audi", "Cupra", "Seat", "Škoda"]);
const BMW = new Set(["BMW", "Mini"]);

export function carTitle(car: Car) {
  const { brand, model } = car.data;
  return [brand === "Andere" ? null : brand, model].filter(Boolean).join(" ");
}

export function carCollections(car: Car): Collection[] {
  const list: Collection[] = [];
  if (car.data.brand && VAG.has(car.data.brand)) list.push("VAG");
  if (car.data.brand && BMW.has(car.data.brand)) list.push("BMW & Mini");
  if (car.data.premium) list.push("Premium & Performance");
  return list;
}

export const isSold = (car: Car) => car.data.status === "Verkocht";

const statusRank = { Beschikbaar: 0, Gereserveerd: 1, Verkocht: 2 } as const;

/** Available first, then reserved, then sold; newest first within each group. */
export function sortCars(cars: Car[]) {
  return [...cars].sort((a, b) => {
    const rank = statusRank[a.data.status ?? "Beschikbaar"] - statusRank[b.data.status ?? "Beschikbaar"];
    if (rank) return rank;
    return new Date(b.first_publication_date).getTime() - new Date(a.first_publication_date).getTime();
  });
}

export function mainImage(car: Car): ImageField {
  return car.data.gallery.find((g) => g.image?.url)?.image ?? ({} as ImageField);
}

/** The few fields a car card and the filters need, small enough to send to the browser. */
export type CarSummary = {
  uid: string;
  href: string;
  title: string;
  brand: string;
  model: string;
  highlights: string;
  status: "Beschikbaar" | "Gereserveerd" | "Verkocht";
  price: number | null;
  vat: string | null;
  year: number | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  powerHp: number | null;
  image: ImageField;
  paint: Paint;
  collections: Collection[];
};

export function summarize(car: Car): CarSummary {
  const d = car.data;
  return {
    uid: car.uid,
    href: carPath(car.uid),
    title: carTitle(car),
    brand: d.brand ?? "Andere",
    model: d.model ?? "",
    highlights: d.highlights ?? "",
    status: d.status ?? "Beschikbaar",
    price: d.price,
    vat: d.vat,
    year: d.year,
    mileage: d.mileage,
    fuel: d.fuel,
    transmission: d.transmission,
    powerHp: d.power_hp,
    image: mainImage(car),
    paint: paintOf(d.color),
    collections: carCollections(car),
  };
}

export type FinanceSettings = { rate: number; months: number; downPercent: number };

/** Indicative monthly payment for a car loan (annuity). */
export function monthlyPayment(price: number, { rate, months, downPercent }: FinanceSettings) {
  const loan = price * (1 - downPercent / 100);
  const r = rate / 100 / 12;
  const monthly = r === 0 ? loan / months : (loan * r) / (1 - Math.pow(1 + r, -months));
  return { monthly, down: price - loan, total: price - loan + monthly * months };
}
