import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import type { CSSProperties } from "react";

import { Img } from "@/components/Img";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { mainImage } from "@/lib/cars";
import { getCars } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type CtaBannerProps = SliceComponentProps<Content.CtaBannerSlice, SliceContext>;

/** The close: a field of monogram gold, the line, and the ways to reach BVB as cells of one bar. */
const CtaBanner = async ({ slice, context }: CtaBannerProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);
  const photos = (await getCars())
    .map(mainImage)
    .filter((i) => i?.url)
    .slice(0, 24);
  const primary = p.buttons.find((b) => isFilled.link(b.link));
  const first = site.contacts[0];

  const cells = [
    p.show_contact && site.phone && (
      <a key="tel" href={telHref(first?.phone ?? site.phone)}>
        {first ? `Bel ${first.name}` : "Bellen"}
      </a>
    ),
    p.show_contact && site.whatsapp && (
      <a key="wa" href={whatsappHref(site.whatsapp)} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
    ),
    primary && (
      <PrismicLink key="primary" field={primary.link} className="primary">
        {primary.label || primary.link.text}
      </PrismicLink>
    ),
  ].filter(Boolean);

  return (
    <section data-slice-type={slice.slice_type} className="sec overflow-hidden bg-gold !pt-6 text-night">
      {photos.length > 3 && (
        <div className="strip mb-[clamp(3rem,6cqw,5rem)]" aria-hidden="true">
          <div className="strip-track">
            {[...photos, ...photos].map((image, i) => (
              <div key={i}>
                <Img field={image} alt="" fill sizes="13rem" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      <Reveal className="frame">
        <Title field={p.title} className="speed head max-w-[18ch]" />
        {isFilled.richText(p.intro) && (
          <div className="lead mt-6 max-w-[40rem]">
            <InlineRichText field={p.intro} />
          </div>
        )}
        {cells.length > 0 && (
          <div className="cells" style={{ "--n": cells.length } as CSSProperties}>
            {cells}
          </div>
        )}
      </Reveal>
    </section>
  );
};

export default CtaBanner;
