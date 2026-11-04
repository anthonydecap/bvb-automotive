import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type FeaturesProps = SliceComponentProps<Content.FeaturesSlice>;

/**
 * Reasons, brands, services: the heading holds still on the left while the items pass on the right,
 * each a short title in large type over its explanation. No icons, no cards, no rules.
 */
const Features = ({ slice }: FeaturesProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";
  const muted = dark ? "text-fog" : "";
  const many = p.items.length > 4;
  const titled = isFilled.richText(p.title) || isFilled.richText(p.intro);

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
        {titled && (
          <div className="lg:col-span-5">
            <Reveal className={many ? "lg:sticky lg:top-32" : ""}>
              <Title field={p.title} className="heading" />
              {isFilled.richText(p.intro) && (
                <div className={`mt-6 max-w-[42ch] space-y-4 text-body ${muted}`}>
                  <InlineRichText field={p.intro} />
                </div>
              )}
            </Reveal>
          </div>
        )}
        <ul
          className={`grid gap-x-8 gap-y-12 lg:gap-y-16 ${titled ? `lg:col-span-6 lg:col-start-7 ${many ? "sm:grid-cols-2" : ""}` : "sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3"}`}
        >
          {p.items.map((item, i) => (
            <Reveal as="li" key={i}>
              <h3 className="text-lead font-semibold tracking-[-0.01em]">{item.title}</h3>
              <RichText field={item.text} className={`prose-bvb mt-3 text-body ${muted}`} />
              {isFilled.link(item.link) && (
                <PrismicLink field={item.link} className="link mt-4 inline-block font-medium">
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
