import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type StepsProps = SliceComponentProps<Content.StepsSlice>;

/** Fields from the paint chart, light to dark, so the last stage is the deepest. */
const paints = [
  { hex: "#a4a8aa", ink: true },
  { hex: "#565b5f", ink: false },
  { hex: "#1f4c9c", ink: false },
  { hex: "#17181b", ink: false },
];

/** Column spans and heights per number of stages: each tile is larger than the one before. */
const plans: Record<number, { span: number; h: string; m: string }[]> = {
  2: [
    { span: 5, h: "40svh", m: "28vw" },
    { span: 7, h: "60svh", m: "40vw" },
  ],
  3: [
    { span: 3, h: "30svh", m: "22vw" },
    { span: 4, h: "44svh", m: "30vw" },
    { span: 5, h: "60svh", m: "40vw" },
  ],
  4: [
    { span: 2, h: "26svh", m: "20vw" },
    { span: 3, h: "36svh", m: "26vw" },
    { span: 3, h: "48svh", m: "32vw" },
    { span: 4, h: "60svh", m: "40vw" },
  ],
};

/**
 * Stages carried by size. A row of flat paint fields, bottom-aligned, each taller than the one before,
 * the stage named inside it and explained under it. More than four stages become a row to drag.
 */
const Steps = ({ slice }: StepsProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";
  const n = p.items.length;
  const plan = plans[n];
  const muted = dark ? "text-fog" : "";

  const heading = (
    <>
      <Title field={p.title} className="heading max-w-[13ch]" />
      {isFilled.richText(p.intro) && (
        <div className={`mt-5 max-w-[40ch] space-y-4 text-body ${muted}`}>
          <InlineRichText field={p.intro} />
        </div>
      )}
    </>
  );

  if (!plan) {
    // Many stages: a row the visitor drags, tiles growing from left to right.
    return (
      <Section slice={slice} tone={p.tone} className="overflow-hidden">
        <Reveal className="frame">{heading}</Reveal>
        <div className="frame">
          <ol className="no-scrollbar mt-14 flex snap-x snap-mandatory items-end gap-[var(--gap)] overflow-x-auto pb-2">
            {p.items.map((step, i) => {
              const paint = paints[Math.min(paints.length - 1, Math.floor((i / n) * paints.length))];
              return (
                <li key={i} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[24vw]">
                  <div
                    className={`flex items-end p-5 lg:p-6 ${paint.ink ? "text-ink" : "text-chalk"}`}
                    style={{ backgroundColor: paint.hex, height: `calc(${16 + i * 3}svh + 5rem)` }}
                  >
                    <h3 className="text-lead font-semibold">{step.title}</h3>
                  </div>
                  <RichText field={step.text} className={`prose-bvb mt-4 text-body ${muted}`} />
                </li>
              );
            })}
          </ol>
        </div>
      </Section>
    );
  }

  const first2 = plan[0].span + (plan[1]?.span ?? 0);

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="frame grid gap-x-[var(--gap)] gap-y-7 lg:grid-cols-12 lg:gap-y-5">
        <Reveal
          className="mb-5 lg:row-start-1 lg:mb-0 lg:self-start lg:pr-8 lg:[grid-column:var(--hc)]"
          style={{ "--hc": `1 / span ${first2}` } as CSSProperties}
        >
          {heading}
        </Reveal>
        <ol className="contents">
          {p.items.map((step, i) => {
            const paint = paints[n === 2 ? i + 2 : n === 3 ? i + 1 : i];
            let start = 1;
            for (let k = 0; k < i; k++) start += plan[k].span;
            const col = {
              "--col": `${start} / span ${plan[i].span}`,
              "--h": plan[i].h,
              "--m": plan[i].m,
            } as CSSProperties;
            return (
              <li key={i} className="lg:contents">
                <div
                  className={`flex h-[max(var(--m),5.5rem)] items-end p-5 lg:row-start-1 lg:h-[var(--h)] lg:self-end lg:[grid-column:var(--col)] lg:p-6 ${
                    paint.ink ? "text-ink" : "text-chalk"
                  }`}
                  style={{ ...col, backgroundColor: paint.hex }}
                >
                  <h3 className="text-lead font-semibold">{step.title}</h3>
                </div>
                <div className="mt-4 lg:row-start-2 lg:mt-0 lg:[grid-column:var(--col)] lg:pr-6" style={col}>
                  <RichText field={step.text} className={`prose-bvb text-body ${muted}`} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
};

export default Steps;
