import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Reveal } from "@/components/Reveal";
import { InlineRichText } from "@/components/RichText";
import { Section } from "@/components/Section";

export type QuoteProps = SliceComponentProps<Content.QuoteSlice>;

/** One statement, at statement size, set left on the grid. */
const Quote = ({ slice }: QuoteProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";

  return (
    <Section slice={slice} tone={p.tone} className="py-[calc(var(--section)*0.8)]">
      <Reveal className="frame grid lg:grid-cols-12">
        <figure className="lg:col-span-9 lg:col-start-3">
          <blockquote className="text-[clamp(1.4rem,1.1rem+1.2vw,2.25rem)] leading-[1.25] font-semibold [font-stretch:105%]">
            <InlineRichText field={p.quote} />
          </blockquote>
          {p.author && (
            <figcaption className={`mt-6 text-body ${dark ? "text-fog" : ""}`}>{p.author}</figcaption>
          )}
        </figure>
      </Reveal>
    </Section>
  );
};

export default Quote;
