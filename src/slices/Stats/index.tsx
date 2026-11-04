import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Section } from "@/components/Section";

export type StatsProps = SliceComponentProps<Content.StatsSlice>;

const Stats = ({ slice }: StatsProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";

  return (
    <Section slice={slice} tone={p.tone} className="!py-14 lg:!py-16">
      <div className="container-x">
        <dl
          className={`grid gap-px overflow-hidden rounded-md border sm:grid-cols-2 ${
            p.items.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } ${dark ? "border-white/10 bg-white/10" : "border-bone bg-bone"}`}
        >
          {p.items.map((item, i) => (
            <div key={i} className={`p-7 lg:p-8 ${dark ? "bg-ink" : "bg-paper"}`}>
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className={`display block text-4xl lg:text-5xl ${dark ? "text-gold" : "text-gold-deep"}`}>
                  {item.value}
                </span>
                <span className={`mt-3 block text-[0.9375rem] ${dark ? "text-fog" : "text-stone"}`}>{item.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
};

export default Stats;
