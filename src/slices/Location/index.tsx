import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Arrow } from "@/components/Icons";
import { Img } from "@/components/Img";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { RouteMap } from "@/components/RouteMap";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type LocationProps = SliceComponentProps<Content.LocationSlice, SliceContext>;

/** The way to Geel: pick a city and watch the route; the last kilometre on the street map. */
const Location = ({ slice, context }: LocationProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);
  const trips = p.travel
    .filter((t) => t.from && t.time)
    .map((t) => ({ from: t.from!, time: t.time!, route: t.route ?? "" }));

  return (
    <section data-slice-type={slice.slice_type} className="sec bg-navy text-chalk" data-tone="navy">
      <div className="frame">
        <Reveal className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <Title field={p.title} className="speed text-[clamp(1.6rem,1rem+2cqw,3rem)]" />
          </div>
          <div className="max-w-[46rem] space-y-4 text-mist lg:col-span-7">
            <InlineRichText field={p.intro} />
          </div>
        </Reveal>

        <RouteMap
          trips={trips}
          inset={
            isFilled.image(p.image) ? (
              <a
                href={site.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-night p-2 pr-5"
                aria-label={`De laatste kilometer: open ${site.street} in Google Maps`}
              >
                <span className="relative block size-24 shrink-0 overflow-hidden">
                  <Img
                    field={p.image}
                    fill
                    sizes="16rem"
                    className="object-cover grayscale transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 bg-gold"
                    aria-hidden="true"
                  />
                </span>
                <span className="block text-small">
                  <span className="block font-semibold">De laatste kilometer</span>
                  <span className="block text-mist">Afrit Geel-West, {site.street}</span>
                  <span className="mt-1 block font-semibold text-gold">Open in Google Maps</span>
                </span>
              </a>
            ) : undefined
          }
        />

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          {isFilled.link(p.button_link) && (
            <PrismicLink field={p.button_link} className="btn btn-gold">
              {p.button_label || "Plan uw route"}
              <Arrow />
            </PrismicLink>
          )}
          <p>
            {site.street}, {site.city}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Location;
