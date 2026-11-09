import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Check } from "@/components/Icons";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type FeaturesProps = SliceComponentProps<Content.FeaturesSlice>;

/**
 * Reasons, brands, services: the title holds on the left while the items pass on the right, each a
 * slanted title over its explanation.
 */
const Features = ({ slice }: FeaturesProps) => {
  const p = slice.primary;
  const titled = isFilled.richText(p.title) || isFilled.richText(p.intro);

  // "Lijst": a calm checklist, the title beside it, no slanted capitals.
  if (p.layout === "Lijst") {
    return (
      <Section slice={slice} tone={p.tone}>
        <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-12">
          {titled && (
            <Reveal className="space-y-5 lg:col-span-4">
              <Title field={p.title} className="speed text-[clamp(1.5rem,1rem+1.6cqw,2.6rem)]" />
              {isFilled.richText(p.intro) && (
                <div className="space-y-3 text-mist">
                  <InlineRichText field={p.intro} />
                </div>
              )}
            </Reveal>
          )}
          <ul
            className={`grid gap-x-10 gap-y-8 sm:grid-cols-2 ${titled ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-12 lg:grid-cols-3"}`}
          >
            {p.items.map((item, i) => (
              <Reveal as="li" key={i} className="flex gap-4">
                <span
                  className="mt-1 grid size-6 shrink-0 place-items-center bg-gold text-night"
                  aria-hidden="true"
                >
                  <Check size={16} />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <RichText field={item.text} className="prose-bvb mt-1 text-mist" />
                  {isFilled.link(item.link) && (
                    <PrismicLink field={item.link} className="link mt-2 inline-block">
                      {item.link_label || "Meer info"}
                    </PrismicLink>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>
    );
  }

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="frame">
        {titled && (
          <Reveal className="sec-head">
            <Title field={p.title} className="speed head" />
            {isFilled.richText(p.intro) && (
              <div className="lead space-y-4 text-mist">
                <InlineRichText field={p.intro} />
              </div>
            )}
          </Reveal>
        )}
        <ul
          className={`grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:gap-y-16 ${
            p.items.length % 3 === 0 || p.items.length > 4
              ? "lg:grid-cols-3"
              : p.items.length === 4
                ? "lg:grid-cols-4"
                : ""
          }`}
        >
          {p.items.map((item, i) => (
            <Reveal as="li" key={i}>
              <h3 className="speed-item">{item.title}</h3>
              <RichText field={item.text} className="prose-bvb mt-4 text-mist" />
              {isFilled.link(item.link) && (
                <PrismicLink field={item.link} className="link mt-4 inline-block">
                  {item.link_label || "Meer info"}
                </PrismicLink>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Features;
