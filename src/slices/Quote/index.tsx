import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Reveal } from "@/components/Reveal";
import { InlineRichText } from "@/components/RichText";
import { Section } from "@/components/Section";

export type QuoteProps = SliceComponentProps<Content.QuoteSlice>;

const Quote = ({ slice }: QuoteProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";

  return (
    <Section slice={slice} tone={p.tone} className="!py-20 lg:!py-28">
      <Reveal className="container-x">
        <figure className="mx-auto max-w-5xl text-center">
          <span className={`display block text-7xl leading-none ${dark ? "text-gold" : "text-gold-deep"}`} aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="display mt-2 text-[1.75rem] !leading-[1.2] font-semibold sm:text-4xl lg:text-5xl">
            <InlineRichText field={p.quote} />
          </blockquote>
          {p.author && (
            <figcaption className={`eyebrow mt-8 ${dark ? "text-mist" : "text-stone"}`}>{p.author}</figcaption>
          )}
        </figure>
      </Reveal>
    </Section>
  );
};

export default Quote;
