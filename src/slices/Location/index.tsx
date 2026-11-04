import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Img } from "@/components/Img";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type LocationProps = SliceComponentProps<Content.LocationSlice, SliceContext>;

/** Where the lot is: the drive from each city in large type, beside the map of Winkelom. */
const Location = ({ slice, context }: LocationProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);

  return (
    <Section slice={slice} tone="Donker">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <Title field={p.title} className="heading" />
          {isFilled.richText(p.intro) && (
            <div className="mt-6 max-w-[48ch] space-y-4 text-body text-fog">
              <InlineRichText field={p.intro} />
            </div>
          )}
          {p.travel.length > 0 && (
            <dl className="mt-12 grid gap-y-5">
              {p.travel.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6">
                  <dt className="text-lead font-semibold">{t.from}</dt>
                  <dd className="tabular text-lead font-semibold text-gold">{t.time}</dd>
                  {t.route && <dd className="col-span-2 text-small text-mist">{t.route}</dd>}
                </div>
              ))}
            </dl>
          )}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            {isFilled.link(p.button_link) && (
              <PrismicLink field={p.button_link} className="btn btn-gold">
                {p.button_label || "Plan uw route"}
              </PrismicLink>
            )}
            <p className="text-body">
              {site.street}, {site.city}
            </p>
          </div>
        </Reveal>
        <a
          href={site.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-square overflow-hidden bg-graphite lg:col-span-6"
          aria-label={`Open ${site.street}, ${site.city} in Google Maps`}
        >
          <Img
            field={p.image}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover grayscale transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" aria-hidden="true">
            <svg width="40" height="52" viewBox="0 0 44 56">
              <path d="M22 55S3 34.5 3 21a19 19 0 1 1 38 0c0 13.5-19 34-19 34Z" fill="#cfae57" />
              <circle cx="22" cy="21" r="7" fill="#111214" />
            </svg>
          </span>
        </a>
      </div>
    </Section>
  );
};

export default Location;
