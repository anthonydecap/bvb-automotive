import { asText, isFilled } from "@prismicio/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CarCard } from "@/components/CarCard";
import { CarGallery } from "@/components/CarGallery";
import { ContactButtons } from "@/components/ContactButtons";
import { ContactForm } from "@/components/ContactForm";
import { ArrowRight, Check, ChevronRight, Phone, WhatsApp } from "@/components/Icons";
import { InlineRichText, RichText } from "@/components/RichText";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { StickyBar } from "@/components/StickyBar";
import { StatusBadge } from "@/components/StatusBadge";
import { carCollections, carTitle, isSold, mainImage, monthlyPayment, summarize } from "@/lib/cars";
import { getCar, getCars, getSettings } from "@/lib/content";
import { formatKm, formatNumber, formatPrice, telHref, whatsappHref } from "@/lib/format";
import { buildMetadata, imageUrl, siteUrl } from "@/lib/metadata";
import { carPath } from "@/lib/routes";
import { paintOf } from "@/lib/paint";
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
  const facts = [
    d.year,
    d.mileage ? formatKm(d.mileage) : null,
    d.power_hp ? `${d.power_hp} pk` : null,
    d.transmission,
  ]
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
  const highlights = (d.highlights ?? "")
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);
  const url = `${siteUrl}${carPath(car.uid)}`;
  const message = `Hallo, ik heb interesse in de ${title}${d.year ? ` (${d.year})` : ""}: ${url}`;

  const finance =
    !sold && d.price && s.finance_rate !== null && s.finance_months
      ? monthlyPayment(d.price, {
          rate: s.finance_rate,
          months: s.finance_months,
          downPercent: s.finance_down ?? 0,
        })
      : undefined;
  const financeHref = href(s.finance_link) ?? "/financiering";

  const keySpecs = [
    { label: "Bouwjaar", value: d.first_registration || d.year },
    { label: "Kilometerstand", value: d.mileage ? formatKm(d.mileage) : null },
    {
      label: "Vermogen",
      value: d.power_hp ? `${d.power_hp} pk${d.power_kw ? `, ${d.power_kw} kW` : ""}` : null,
    },
    { label: "Transmissie", value: d.gearbox || d.transmission },
    { label: "Brandstof", value: d.fuel },
    { label: "Aandrijving", value: d.drivetrain },
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

  const options = d.options.map((node) => ("text" in node ? node.text.trim() : "")).filter(Boolean);

  const similar = all
    .filter((c) => c.uid !== car.uid && !isSold(c) && (!collection || carCollections(c).includes(collection)))
    .slice(0, 4);
  const more = similar.length ? similar : all.filter((c) => c.uid !== car.uid && !isSold(c)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    brand: { "@type": "Brand", name: d.brand },
    model: d.model,
    vehicleModelDate: d.year ? String(d.year) : undefined,
    mileageFromOdometer: d.mileage
      ? { "@type": "QuantitativeValue", value: d.mileage, unitCode: "KMT" }
      : undefined,
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

  const paint = paintOf(d.color);
  const softOnPaint = "text-mist";

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* The car, its price and its numbers. */}
      <section className="bg-night pt-28 pb-[var(--section)] text-chalk lg:pt-32">
        <div className="frame">
          <nav aria-label="Kruimelpad" className={`mb-8 text-small ${softOnPaint}`}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="link">
                  Home
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden="true" />
              <li>
                <Link href="/aanbod" className="link">
                  Aanbod
                </Link>
              </li>
              {collectionPage && (
                <>
                  <ChevronRight size={14} aria-hidden="true" />
                  <li>
                    <Link href={collectionPage.href} className="link">
                      {collectionPage.label}
                    </Link>
                  </li>
                </>
              )}
              <ChevronRight size={14} aria-hidden="true" />
              <li aria-current="page">{d.model}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-8">
              <CarGallery images={images} title={title} />
            </div>

            <aside className="min-w-0 lg:col-span-4">
              <div>
                <h1 className="speed text-[clamp(2rem,1rem+2.4vw,3.4rem)]">
                  <span className="sr-only">{d.brand} </span>
                  {d.model}
                </h1>
                <p className={`mt-4 text-body ${softOnPaint}`}>
                  <StatusBadge status={d.status ?? "Beschikbaar"} className="mr-3 align-baseline" />
                  {[d.brand, paint.name].filter(Boolean).join(", ")}
                  {highlights.length > 0 && <>. {highlights.join(", ")}</>}
                </p>

                <div id="prijs" className="mt-8">
                  {sold ? (
                    <>
                      <p className="speed head text-gold">Verkocht</p>
                      <p className="mt-3 text-body">
                        Deze wagen heeft een nieuwe eigenaar gevonden. Zoekt u iets gelijkaardigs? We gaan
                        graag voor u op zoek.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="speed head tabular text-gold">
                        {d.price ? formatPrice(d.price) : "Prijs op aanvraag"}
                      </p>
                      <p className={`mt-2 text-small ${softOnPaint}`}>
                        {d.vat?.startsWith("BTW")
                          ? "Incl. btw, btw-wagen: btw aftrekbaar"
                          : d.vat
                            ? "Margewagen, btw niet aftrekbaar"
                            : "Incl. btw"}
                      </p>
                      {finance && (
                        <Link href={financeHref} className="link mt-4 inline-block text-body font-medium">
                          Financieren vanaf ± {formatPrice(finance.monthly)} per maand
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {keySpecs.length > 0 && (
                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                    {keySpecs.map((spec) => (
                      <div key={spec.label} className="flex flex-col-reverse">
                        <dt className={`text-small ${softOnPaint}`}>{spec.label}</dt>
                        <dd className="tabular text-body font-bold [font-stretch:105%]">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-8 grid gap-2">
                  <a href="#interesse" className="btn btn-gold w-full whitespace-normal text-center">
                    {sold ? "Laat ons een gelijkaardige wagen zoeken" : "Plan een bezichtiging of proefrit"}
                    <ArrowRight size={18} className="arrow" />
                  </a>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {site.phone && (
                      <a href={telHref(site.phone)} className="btn btn-ghost">
                        <Phone size={18} /> Bellen
                      </a>
                    )}
                    {site.whatsapp && (
                      <a
                        href={whatsappHref(site.whatsapp, message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                      >
                        <WhatsApp size={18} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {badges.length > 0 && (
                  <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
                    {badges.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <Check size={16} className="shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section bg-studio text-studio-ink">
        <div className="frame grid gap-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <h2 className="speed head text-studio-navy">Over deze wagen</h2>
            <RichText field={d.description} className="prose-bvb mt-8 text-body" />

            {isFilled.richText(d.extras) && (
              <div className="mt-10 bg-white p-6 sm:p-8">
                <h3 className="text-lead font-semibold text-studio-navy">Goed om te weten</h3>
                <RichText field={d.extras} className="prose-bvb mt-3 text-body" />
              </div>
            )}

            {options.length > 0 && (
              <div className="mt-16">
                <h2 className="text-lead font-semibold text-studio-navy">
                  Uitrusting <span className="tabular text-[#5a5c72]">({options.length})</span>
                </h2>
                <ul className="prose-bvb mt-6 grid max-w-none gap-x-8 gap-y-2 text-body sm:grid-cols-2 [&>*+*]:mt-0">
                  {options.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-lead font-semibold text-studio-navy">Specificaties</h2>
              <table className="tabular mt-6 w-full text-body">
                <caption className="sr-only">Specificaties van de {title}</caption>
                <tbody className="divide-y divide-[#cfd2da]" /* taste-skill-ignore: rows of a real table */>
                  {specs
                    .filter(([, v]) => v !== null && v !== undefined && v !== "")
                    .map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row" className="py-3 pr-6 text-left font-normal text-[#5a5c72]">
                          {label}
                        </th>
                        <td className="py-3 text-right font-semibold">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {isFilled.link(d.autoscout_url) && (
                <a
                  href={href(d.autoscout_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link mt-6 inline-block font-medium text-studio-navy hover:text-studio-ink"
                >
                  Bekijk deze wagen op AutoScout24
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {s.car_promise.length > 0 && (
        <section className="section bg-ink text-chalk">
          <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-8">
            <h2 className="speed head lg:col-span-4">Bij elke wagen</h2>
            <Reveal as="ul" className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {s.car_promise.map((item, i) => (
                <li key={i}>
                  <h3 className="text-lead font-semibold">{item.title}</h3>
                  <p className="mt-2 text-body text-fog">{item.text}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section id="interesse" className="section scroll-mt-24 bg-night">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <h2 className="speed head">
              {sold ? "We zoeken graag mee" : s.car_cta_title || "Interesse in deze wagen?"}
            </h2>
            <div className="mt-6 max-w-[46ch] space-y-4 text-body">
              {sold ? (
                <p>
                  Deze {title} is verkocht, maar er komen elke week nieuwe wagens binnen. Laat weten wat u
                  zoekt, dan houden we u op de hoogte of importeren we op aanvraag.
                </p>
              ) : (
                <InlineRichText field={s.car_cta_text} />
              )}
            </div>
            <ContactButtons site={site} message={message} className="mt-8" phoneClassName="btn-ink" />
          </Reveal>
          <div className="bg-navy p-6 sm:p-10 lg:col-span-7">
            <ContactForm site={site} car={`${title}${d.year ? ` (${d.year})` : ""}`} />
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section bg-night pt-0">
          <div className="frame">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="speed head">Ook in de showroom</h2>
              <Link
                href={collectionPage && similar.length ? collectionPage.href : "/aanbod"}
                className="link font-medium"
              >
                Bekijk {collectionPage && similar.length ? collectionPage.label : "het volledige aanbod"}
              </Link>
            </div>
            <Reveal
              as="ul"
              className="grid-cols-cars grid-cars grid gap-x-[var(--gap)] gap-y-14 sm:grid-cols-2 xl:grid-cols-4"
            >
              {more.map((c) => (
                <li key={c.uid}>
                  <CarCard car={summarize(c)} />
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Sticky contact bar on small screens */}
      {!sold && (
        <StickyBar after="#prijs" until="#interesse">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-small text-fog">{d.model}</p>
              <p className="tabular font-semibold">{d.price ? formatPrice(d.price) : "Prijs op aanvraag"}</p>
            </div>
            {site.phone && (
              <a
                href={telHref(site.phone)}
                className="grid size-12 place-items-center bg-graphite"
                aria-label="Bellen"
              >
                <Phone size={19} />
              </a>
            )}
            {site.whatsapp && (
              <a
                href={whatsappHref(site.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold px-4"
              >
                <WhatsApp size={18} /> WhatsApp
              </a>
            )}
          </div>
        </StickyBar>
      )}
    </Shell>
  );
}
