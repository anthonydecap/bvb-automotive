import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

export type StatsProps = SliceComponentProps<Content.StatsSlice>;

/** A few numbers, large, each with what it counts. No boxes. */
const Stats = ({ slice }: StatsProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";

  return (
    <Section slice={slice} tone={p.tone} className="py-[calc(var(--section)*0.7)]">
      <h2 className="sr-only">In cijfers</h2>
      <Reveal
        as="dl"
        className={`frame grid gap-x-8 gap-y-10 sm:grid-cols-2 ${p.items.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {p.items.map((item, i) => (
          <div key={i}>
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="heading block">{item.value}</span>
              <span className={`mt-3 block text-body ${dark ? "text-fog" : ""}`}>{item.label}</span>
            </dd>
          </div>
        ))}
      </Reveal>
    </Section>
  );
};

export default Stats;
