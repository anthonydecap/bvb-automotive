import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ArrowUpRight } from "@/components/Icons";
import { Img } from "@/components/Img";
import { Logo } from "@/components/Logo";
import { PrismicLink } from "@/components/PrismicLink";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type LocationProps = SliceComponentProps<Content.LocationSlice, SliceContext>;

const Location = ({ slice, context }: LocationProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);

  return (
    <Section slice={slice} tone="Donker" className="overflow-hidden">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} dark />
          {p.travel.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10">
              {p.travel.map((t, i) => (
                <div key={i} className="bg-ink p-5">
                  <dt className="spec-label text-mist">Vanuit {t.from}</dt>
                  <dd className="mt-2">
                    <span className="display text-3xl text-gold">{t.time}</span>
                    {t.route && <span className="mt-1 block text-sm text-mist">{t.route}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {isFilled.link(p.button_link) && (
            <PrismicLink field={p.button_link} className="btn btn-gold mt-10">
              {p.button_label || "Route"}
              <ArrowUpRight size={18} />
            </PrismicLink>
          )}
        </div>
        <div className="lg:col-span-6">
          <a
            href={site.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-md border border-white/10 bg-graphite"
            aria-label={`Open ${site.street}, ${site.city} in Google Maps`}
          >
            <Img
              field={p.image}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover opacity-70 contrast-125 grayscale transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden="true" />
            {/* Pin at the position of the showroom on the map image */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" aria-hidden="true">
              <span className="absolute top-full left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold/25" />
              <svg width="44" height="56" viewBox="0 0 44 56" className="relative drop-shadow-xl">
                <path d="M22 55S3 34.5 3 21a19 19 0 1 1 38 0c0 13.5-19 34-19 34Z" fill="#cfae57" />
                <circle cx="22" cy="21" r="7" fill="#0b0c0e" />
              </svg>
            </span>
            <span className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4">
              <span>
                <Logo className="h-9 w-auto" />
                <span className="mt-3 block text-sm text-white/85">
                  {site.street}, {site.city}
                </span>
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-gold text-ink transition-transform group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </span>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Location;
