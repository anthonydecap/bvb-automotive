import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { PhotoStrip } from "@/components/PhotoStrip";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { mainImage } from "@/lib/cars";
import { getCars } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type CtaBannerProps = SliceComponentProps<Content.CtaBannerSlice, SliceContext>;

const cell =
  "flex min-h-16 flex-col items-center justify-center px-4 py-3 text-center text-lead font-semibold transition-colors sm:min-h-24";

/**
 * The close of a page: every car that stood on the lot drifts past on a field of monogram gold,
 * and the ways to reach BVB sit underneath as three cells of one bar.
 */
const CtaBanner = async ({ slice, context }: CtaBannerProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);
  const images = (await getCars()).map(mainImage).filter((i) => i?.url);
  const primary = p.buttons.find((b) => isFilled.link(b.link));

  const cells = [
    p.show_contact && site.phone && (
      <a key="tel" href={telHref(site.phone)} className={`${cell} bg-black/10 hover:bg-black/20`}>
        Bel {site.phone}
      </a>
    ),
    p.show_contact && site.whatsapp && (
      <a
        key="wa"
        href={whatsappHref(site.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cell} bg-black/10 hover:bg-black/20`}
      >
        Stuur een WhatsApp
      </a>
    ),
    primary && (
      <PrismicLink
        key="primary"
        field={primary.link}
        className={`${cell} bg-ink text-chalk hover:bg-graphite`}
      >
        {primary.label || primary.link.text}
      </PrismicLink>
    ),
    !primary && site.email && (
      <a key="mail" href={`mailto:${site.email}`} className={`${cell} bg-ink text-chalk hover:bg-graphite`}>
        Mail ons
      </a>
    ),
  ].filter(Boolean);

  return (
    <section
      data-slice-type={slice.slice_type}
      className="overflow-hidden bg-gold pt-12 pb-[var(--section)] text-ink"
    >
      <PhotoStrip images={images} />
      <Reveal className="frame mt-16 lg:mt-20">
        <Title field={p.title} className="heading max-w-[24ch]" />
        {isFilled.richText(p.intro) && (
          <div className="mt-6 max-w-[52ch] text-body">
            <InlineRichText field={p.intro} />
          </div>
        )}
        <div
          className={`mt-10 grid gap-2 ${cells.length === 3 ? "sm:grid-cols-3" : cells.length === 2 ? "sm:grid-cols-2" : ""}`}
        >
          {cells}
        </div>
        {site.hoursNote && <p className="mt-4 text-small">{site.hoursNote}</p>}
      </Reveal>
    </section>
  );
};

export default CtaBanner;
