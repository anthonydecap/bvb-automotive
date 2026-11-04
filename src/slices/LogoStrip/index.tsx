import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Img } from "@/components/Img";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type LogoStripProps = SliceComponentProps<Content.LogoStripSlice>;

/** Certifications and the brands worked with: a heading, then the marks on one row, no boxes. */
const LogoStrip = ({ slice }: LogoStripProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";

  return (
    <Section slice={slice} tone={p.tone} className="py-[calc(var(--section)*0.75)]">
      <div className="frame grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="lg:col-span-4">
          <Title field={p.title} className="speed text-[clamp(1.4rem,1rem+1.1vw,2rem)]" />
          {isFilled.richText(p.intro) && (
            <div className={`mt-3 text-body ${dark ? "text-fog" : ""}`}>
              <InlineRichText field={p.intro} />
            </div>
          )}
        </Reveal>
        <Reveal
          as="ul"
          className="grid grid-cols-3 items-center gap-x-8 gap-y-10 sm:grid-cols-6 lg:col-span-8"
        >
          {p.items.map((item, i) => {
            const logo = (
              <Img
                field={item.logo}
                alt={item.name ?? ""}
                sizes="160px"
                className={`h-auto max-h-11 w-auto max-w-full object-contain brightness-0 invert`}
              />
            );
            return (
              <li key={i} className="flex justify-center">
                {isFilled.link(item.link) ? (
                  <PrismicLink field={item.link} className="opacity-80 transition-opacity hover:opacity-100">
                    {logo}
                  </PrismicLink>
                ) : (
                  logo
                )}
              </li>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
};

export default LogoStrip;
