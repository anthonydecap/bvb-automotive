import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Plus } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/** Questions as filled rows, one step in tone from the ground; the answer opens in place. */
const Faq = ({ slice }: FaqProps) => {
  const p = slice.primary;

  return (
    <Section slice={slice} className="[&+[data-slice-type=faq]]:!pt-0">
      <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading title={p.title} intro={p.intro} />
          </div>
        </div>
        <Reveal className="grid content-start gap-1 lg:col-span-7">
          {p.items.map((item, i) => (
            <details key={i} className="group bg-chalk" name={`faq-${slice.id}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 transition-colors hover:bg-bone sm:px-7 [&::-webkit-details-marker]:hidden">
                <span className="text-lead font-medium">{item.question}</span>
                <span className="grid size-10 shrink-0 place-items-center bg-paper transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-chalk">
                  <Plus size={18} />
                </span>
              </summary>
              <RichText field={item.answer} className="prose-bvb hidden px-5 pb-7 text-body group-open:block sm:px-7" />
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
};

export default Faq;
