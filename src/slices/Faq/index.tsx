import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Plus } from "@/components/Icons";
import { RichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type FaqProps = SliceComponentProps<Content.FaqSlice>;

const Faq = ({ slice }: FaqProps) => {
  const p = slice.primary;

  return (
    <Section slice={slice} className="!py-16 lg:!py-24 [&+[data-slice-type=faq]]:!pt-0">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="border-t border-ink/15">
            {p.items.map((item, i) => (
              <details key={i} className="group border-b border-ink/15" name={`faq-${slice.id}`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="text-lg leading-snug font-semibold sm:text-xl">{item.question}</span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/20 transition-[transform,background-color,color,border-color] duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-gold">
                    <Plus size={18} />
                  </span>
                </summary>
                <RichText field={item.answer} className="prose-bvb pr-14 pb-7 text-ink/75" />
              </details>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Faq;
