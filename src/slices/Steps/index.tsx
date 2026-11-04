import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type StepsProps = SliceComponentProps<Content.StepsSlice>;

const Steps = ({ slice }: StepsProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";
  const many = p.items.length > 4;

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="container-x">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} dark={dark} align="split" />
        <ol
          className={`relative mt-16 grid gap-10 md:grid-cols-2 ${many ? "lg:grid-cols-3" : "lg:grid-cols-4"} lg:gap-x-8 lg:gap-y-14`}
        >
          {p.items.map((step, i) => (
            <Reveal as="li" key={i} delay={(i % 4) * 90} className="relative">
              <div className="flex items-center gap-4">
                <span
                  className={`display grid size-14 shrink-0 place-items-center rounded-full border text-lg ${
                    dark ? "border-gold/50 text-gold" : "border-gold-deep/40 text-gold-deep"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-ink/15"}`} aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl leading-snug font-bold [font-stretch:106%]">{step.title}</h3>
              <RichText
                field={step.text}
                className={`prose-bvb mt-3 text-[0.9875rem] leading-relaxed ${dark ? "text-fog" : "text-stone"}`}
              />
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default Steps;
