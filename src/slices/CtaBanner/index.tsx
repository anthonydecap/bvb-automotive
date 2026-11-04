import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ButtonRow } from "@/components/ButtonLink";
import { ContactButtons } from "@/components/ContactButtons";
import { Img } from "@/components/Img";
import { InlineRichText, Title } from "@/components/RichText";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type CtaBannerProps = SliceComponentProps<Content.CtaBannerSlice, SliceContext>;

const CtaBanner = ({ slice, context }: CtaBannerProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);
  const hasImage = isFilled.image(p.image);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative isolate overflow-hidden bg-ink py-24 text-white lg:py-32"
    >
      {hasImage ? (
        <>
          <Img field={p.image} fill sizes="100vw" className="-z-20 object-cover opacity-60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" aria-hidden="true" />
        </>
      ) : (
        <div className="grid-texture absolute inset-0 -z-10" aria-hidden="true" />
      )}
      <div className="container-x">
        <div className="max-w-3xl">
          {p.eyebrow && <p className="eyebrow mb-5 text-gold">{p.eyebrow}</p>}
          <Title field={p.title} className="text-[2rem] sm:text-5xl lg:text-6xl" />
          {isFilled.richText(p.intro) && (
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">
              <InlineRichText field={p.intro} />
            </div>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonRow buttons={p.buttons} />
            {p.show_contact && <ContactButtons site={site} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
