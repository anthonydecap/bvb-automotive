import { asText, isFilled } from "@prismicio/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CarCard } from "@/components/CarCard";
import { CarGallery } from "@/components/CarGallery";
import { ContactButtons } from "@/components/ContactButtons";
import { ContactForm } from "@/components/ContactForm";
import {
  ArrowRight,
  Bolt,
  Calendar,
  Check,
  ChevronRight,
  Fuel,
  Gauge,
  Gearbox,
  NamedIcon,
  Phone,
  Road,
  WhatsApp,
} from "@/components/Icons";
import { InlineRichText, RichText } from "@/components/RichText";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/StatusBadge";
import { carCollections, carTitle, isSold, mainImage, monthlyPayment, summarize } from "@/lib/cars";
import { getCar, getCars, getSettings } from "@/lib/content";
import { formatKm, formatNumber, formatPrice, telHref, whatsappHref } from "@/lib/format";
import { buildMetadata, imageUrl, siteUrl } from "@/lib/metadata";
import { carPath } from "@/lib/routes";
import { href, siteInfo } from "@/lib/site";

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((car) => ({ uid: car.uid }));
}

export async function generateMetadata({ params }: PageProps<"/aanbod/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const car = await getCar(uid);
  if (!car) return {};
  const d = car.data;
  const title = carTitle(car);
  const facts = [d.year, d.mileage ? formatKm(d.mileage) : null, d.power_hp ? `${d.power_hp} pk` : null, d.transmission]
    .filter(Boolean)
    .join(", ");
  const price = isSold(car) ? "Verkocht" : d.price ? formatPrice(d.price) : "Prijs op aanvraag";
  return buildMetadata({
    title: d.meta_title || `${title}${d.year ? ` (${d.year})` : ""}`,
    description:
      d.meta_description ||
      `${title}: ${facts}. ${price}. Technisch nagekeken, met Car-Pass en volledige detailing bij BVB Automotive in Geel.`,
    image: isFilled.image(d.meta_image) ? d.meta_image : mainImage(car),
    path: carPath(car.uid),
  });
}

/** The page of the collection a car belongs to, for the breadcrumb and "more like this". */
const collectionPages = {
  VAG: { href: "/vag-specialist", label: "VAG Specialist Selectie" },
  "BMW & Mini": { href: "/bmw", label: "BMW & Mini" },
  "Premium & Performance": { href: "/premium-performance", label: "Premium & Performance" },
} as const;

export default async function CarPage({ params }: PageProps<"/aanbod/[uid]">) {
  const { uid } = await params;
  const [car, settings, all] = await Promise.all([getCar(uid), getSettings(), getCars()]);
  if (!car) notFound();

  const d = car.data;
  const s = settings.data;
  const site = siteInfo(settings);
  const title = carTitle(car);
  const sold = isSold(car);
  const images = d.gallery.map((g) => g.image).filter((i) => i?.url);
  const collection = carCollections(car)[0];
  const collectionPage = collection ? collectionPages[collection] : undefined;
  const highlights = (d.highlights ?? "").split("|").map((h) => h.trim()).filter(Boolean);
  const url = `${siteUrl}${carPath(car.uid)}`;
  const message = `Hallo, ik heb interesse in de ${title}${d.year ? ` (${d.year})` : ""}: ${url}`;

  const finance =
    !sold && d.price && s.finance_rate !== null && s.finance_months
      ? monthlyPayment(d.price, { rate: s.finance_rate, months: s.finance_months, downPercent: s.finance_down ?? 0 })
      : undefined;
  const financeHref = href(s.finance_link) ?? "/financiering";

  const keySpecs = [
    { icon: Calendar, label: "Bouwjaar", value: d.first_registration || d.year },
    { icon: Road, label: "Kilometerstand", value: d.mileage ? formatKm(d.mileage) : null },
    { icon: Bolt, label: "Vermogen", value: d.power_hp ? `${d.power_hp} pk${d.power_kw ? ` · ${d.power_kw} kW` : ""}` : null },
    { icon: Gearbox, label: "Transmissie", value: d.gearbox || d.transmission },
    { icon: Fuel, label: "Brandstof", value: d.fuel },
    { icon: Gauge, label: "Aandrijving", value: d.drivetrain },
  ].filter((spec) => spec.value);

  const specs: [string, string | number | null | undefined][] = [
    ["Merk", d.brand],
    ["Model", d.model],
    ["Bouwjaar", d.year],
    ["Eerste inschrijving", d.first_registration],
    ["Kilometerstand", d.mileage ? formatKm(d.mileage) : null],
    ["Brandstof", d.fuel],
    ["Transmissie", [d.transmission, d.gearbox].filter(Boolean).join(", ")],
    ["Vermogen", d.power_hp ? `${d.power_hp} pk${d.power_kw ? ` (${d.power_kw} kW)` : ""}` : null],
    ["Cilinderinhoud", d.engine_cc ? `${formatNumber(d.engine_cc)} cc` : null],
    ["Aandrijving", d.drivetrain],
    ["Euronorm", d.euronorm ? `Euro ${d.euronorm}` : null],
    ["Kleur", d.color],
    ["Interieur", d.interior],
    ["Deuren", d.doors],
    ["Zitplaatsen", d.seats],
    ["Garantie", d.warranty],
    ["Btw", d.vat],
  ];
  const badges = [
    d.carpass && "Car-Pass aanwezig",
    d.accident_free && "100% ongevalvrij",
    d.first_owner && "Eerste eigenaar",
    d.warranty && `${d.warranty} garantie`,
  ].filter(Boolean) as string[];

  const options = d.options
    .map((node) => ("text" in node ? node.text.trim() : ""))
    .filter(Boolean);

  const similar = all
    .filter((c) => c.uid !== car.uid && !isSold(c) && (!collection || carCollections(c).includes(collection)))
    .slice(0, 4);
  const more = similar.length
    ? similar
    : all.filter((c) => c.uid !== car.uid && !isSold(c)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    brand: { "@type": "Brand", name: d.brand },
    model: d.model,
    vehicleModelDate: d.year ? String(d.year) : undefined,
    mileageFromOdometer: d.mileage ? { "@type": "QuantitativeValue", value: d.mileage, unitCode: "KMT" } : undefined,
    fuelType: d.fuel,
    vehicleTransmission: d.transmission,
    color: d.color,
    image: images.slice(0, 6).map((i) => imageUrl(i)),
    description: asText(d.description),
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: d.price ?? undefined,
      availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@type": "AutoDealer", name: site.name, telephone: site.phone },
    },
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative bg-ink pt-28 pb-16 text-white lg:pt-36 lg:pb-24">
        <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-x relative">
          <nav aria-label="Kruimelpad" className="mb-8 text-sm text-mist">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <ChevronRight size={14} className="text-steel" />
              <li>
                <Link href="/aanbod" className="hover:text-white">
                  Aanbod
                </Link>
              </li>
              {collectionPage && (
                <>
                  <ChevronRight size={14} className="text-steel" />
                  <li>
                    <Link href={collectionPage.href} className="hover:text-white">
                      {collectionPage.label}
                    </Link>
                  </li>
                </>
              )}
              <ChevronRight size={14} className="text-steel" />
              <li aria-current="page" className="text-white/90">
                {d.model}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-7 xl:col-span-8">
              <CarGallery images={images} title={title} />
            </div>

            <aside className="min-w-0 lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <StatusBadge status={d.status ?? "Beschikbaar"} className="!bg-white/10" />
                  <p className="spec-label text-gold">{d.brand}</p>
                </div>
                <h1 className="display mt-5 text-4xl sm:text-5xl">{d.model}</h1>
                {highlights.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {highlights.map((h) => (
                      <li key={h} className="spec-label rounded-sm border border-white/15 px-2 py-1 text-fog">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 rounded-md border border-white/10 bg-carbon p-6">
                  {sold ? (
                    <>
                      <p className="display text-3xl text-mist">Verkocht</p>
                      <p className="mt-2 text-fog">
                        Deze wagen heeft een nieuwe eigenaar gevonden. Zoekt u iets gelijkaardigs? We gaan graag voor
                        u op zoek.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="tabular display text-4xl sm:text-5xl">
                        {d.price ? formatPrice(d.price) : "Prijs op aanvraag"}
                      </p>
                      <p className="mt-2 text-sm text-mist">
                        {d.vat?.startsWith("BTW")
                          ? "Incl. btw · btw-wagen, btw aftrekbaar"
                          : d.vat
                            ? "Margewagen · btw niet aftrekbaar"
                            : "Incl. btw"}
                      </p>
                      {finance && (
                        <Link
                          href={financeHref}
                          className="group mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm"
                        >
                          <span>
                            Financieren vanaf{" "}
                            <strong className="tabular text-base text-gold">
                              ± {formatPrice(finance.monthly)}/maand
                            </strong>
                            <span className="block text-xs text-mist">
                              Indicatief, {s.finance_months} maanden, {s.finance_down}% aanbetaling
                            </span>
                          </span>
                          <ArrowRight size={17} className="shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {keySpecs.length > 0 && (
                  <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10">
                    {keySpecs.map((spec) => (
                      <div key={spec.label} className="flex gap-3 bg-ink p-4">
                        <spec.icon size={19} className="mt-0.5 shrink-0 text-gold" />
                        <div className="min-w-0">
                          <dt className="spec-label text-mist">{spec.label}</dt>
                          <dd className="tabular mt-1 text-[0.9375rem] font-semibold hyphens-auto">{spec.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-6 grid gap-3">
                  <a href="#interesse" className="btn btn-gold w-full">
                    {sold ? "Laat ons een gelijkaardige wagen zoeken" : "Plan een bezichtiging of proefrit"}
                    <ArrowRight size={18} />
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    {site.phone && (
                      <a href={telHref(site.phone)} className="btn btn-ghost">
                        <Phone size={18} /> Bellen
                      </a>
                    )}
                    {site.whatsapp && (
                      <a href={whatsappHref(site.whatsapp, message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                        <WhatsApp size={18} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {badges.length > 0 && (
                  <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-fog">
                    {badges.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <Check size={16} className="shrink-0 text-gold" /> {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="on-light bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-gold-deep">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Over deze wagen
            </p>
            <h2 className="display mt-5 text-3xl sm:text-4xl">{title}</h2>
            <RichText field={d.description} className="prose-bvb mt-6 text-lg leading-relaxed text-ink/80" />

            {isFilled.richText(d.extras) && (
              <div className="mt-10 rounded-md border-l-2 border-gold bg-white p-6">
                <p className="spec-label text-gold-deep">Goed om te weten</p>
                <RichText field={d.extras} className="prose-bvb mt-3 text-ink/80" />
              </div>
            )}

            {options.length > 0 && (
              <div className="mt-16">
                <div className="flex items-end justify-between gap-4 border-b border-bone pb-4">
                  <h2 className="display text-2xl sm:text-3xl">Uitrusting</h2>
                  <p className="tabular text-sm text-stone">{options.length} opties</p>
                </div>
                <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {options.map((o) => (
                    <li key={o} className="flex gap-3 text-[0.9875rem]">
                      <Check size={18} className="mt-0.5 shrink-0 text-gold-deep" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 className="display text-2xl sm:text-3xl">Specificaties</h2>
              <dl className="mt-6 divide-y divide-bone border-y border-bone">
                {specs
                  .filter(([, v]) => v !== null && v !== undefined && v !== "")
                  .map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-6 py-3.5 text-[0.9375rem]">
                      <dt className="text-stone">{label}</dt>
                      <dd className="tabular text-right font-semibold">{value}</dd>
                    </div>
                  ))}
              </dl>
              {isFilled.link(d.autoscout_url) && (
                <a
                  href={href(d.autoscout_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep"
                >
                  Bekijk deze wagen op AutoScout24 <ArrowRight size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {s.car_promise.length > 0 && (
        <section className="bg-carbon py-14 text-white">
          <ul className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {s.car_promise.map((item, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded bg-gold/10 text-gold">
                  <NamedIcon name={item.icon} size={22} />
                </span>
                <span>
                  <span className="block font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm text-mist">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="interesse" className="on-light scroll-mt-24 bg-white py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-gold-deep">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {sold ? "Op zoek naar iets gelijkaardigs?" : "Bezichtiging en proefrit"}
            </p>
            <h2 className="display mt-5 text-3xl sm:text-5xl">
              {sold ? "We zoeken graag met u mee" : s.car_cta_title || "Interesse in deze wagen?"}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone">
              {sold ? (
                <p>
                  Deze {title} is verkocht, maar er komen elke week nieuwe wagens binnen. Laat weten wat u zoekt, dan
                  houden we u op de hoogte of importeren we op aanvraag.
                </p>
              ) : (
                <InlineRichText field={s.car_cta_text} />
              )}
            </div>
            <ContactButtons site={site} message={message} className="mt-8" phoneClassName="btn-dark" />
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-md border border-bone bg-paper p-6 sm:p-10">
              <ContactForm site={site} car={`${title}${d.year ? ` (${d.year})` : ""}`} />
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="on-light bg-paper py-20 lg:py-28">
          <div className="container-x">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow flex items-center gap-3 text-gold-deep">
                  <span className="h-px w-8 bg-current" aria-hidden="true" />
                  Ook in de showroom
                </p>
                <h2 className="display mt-5 text-3xl sm:text-4xl">
                  Meer uit {collectionPage && similar.length ? <em>{collectionPage.label}</em> : <em>ons aanbod</em>}
                </h2>
              </div>
              <Link href={collectionPage && similar.length ? collectionPage.href : "/aanbod"} className="btn btn-dark self-start">
                Bekijk alles <ArrowRight size={18} />
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {more.map((c) => (
                <li key={c.uid}>
                  <CarCard car={summarize(c)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Sticky contact bar on small screens */}
      {!sold && (
        <div data-sticky-bar className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 text-white backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-mist">{d.model}</p>
              <p className="tabular font-bold">{d.price ? formatPrice(d.price) : "Prijs op aanvraag"}</p>
            </div>
            {site.phone && (
              <a href={telHref(site.phone)} className="grid size-11 place-items-center rounded border border-white/20" aria-label="Bellen">
                <Phone size={19} />
              </a>
            )}
            {site.whatsapp && (
              <a
                href={whatsappHref(site.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp min-h-11 px-4"
              >
                <WhatsApp size={18} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
