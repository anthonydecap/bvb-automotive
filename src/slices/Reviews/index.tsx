import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ArrowUpRight, StarFilled } from "@/components/Icons";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { formatDate } from "@/lib/format";
import type { SliceContext } from "@/lib/slice-context";

export type ReviewsProps = SliceComponentProps<Content.ReviewsSlice, SliceContext>;

const Stars = () => (
  <span className="flex gap-0.5 text-gold" aria-label="5 op 5 sterren">
    {Array.from({ length: 5 }, (_, i) => (
      <StarFilled key={i} size={16} />
    ))}
  </span>
);

const Reviews = ({ slice, context }: ReviewsProps) => {
  const p = slice.primary;
  const s = context.settings.data;
  const own = p.items.filter((r) => isFilled.richText(r.quote));
  const reviews = own.length ? own : s.reviews.filter((r) => isFilled.richText(r.quote));

  return (
    <Section slice={slice} tone="Wit">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
            {s.rating && (
              <div className="mt-10 flex items-center gap-5 rounded-md border border-bone bg-paper p-5">
                <span className="display text-5xl">{s.rating}</span>
                <span>
                  <Stars />
                  <span className="mt-1.5 block text-sm text-stone">gemiddelde score op {s.rating_source}</span>
                </span>
              </div>
            )}
            {isFilled.link(p.button_link) && (
              <PrismicLink field={p.button_link} className="btn btn-dark mt-6">
                {p.button_label || "Alle reviews"}
                <ArrowUpRight size={17} />
              </PrismicLink>
            )}
          </div>
          <ul className={`grid gap-5 sm:grid-cols-2 lg:col-span-8 ${reviews.length === 2 ? "lg:self-center" : ""}`}>
            {reviews.map((r, i) => (
              <Reveal
                as="li"
                key={i}
                delay={(i % 2) * 100}
                className="flex flex-col rounded-md border border-bone bg-paper p-7 lg:p-8"
              >
                <Stars />
                <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink/85">
                  <InlineRichText field={r.quote} />
                </blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-bone pt-5 text-sm">
                  <span className="grid size-9 place-items-center rounded-full bg-ink font-semibold text-gold">
                    {(r.name || "K").charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold">{r.name || "Klant via AutoScout24"}</span>
                    {r.date && <span className="text-stone">{formatDate(r.date)}</span>}
                  </span>
                </footer>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default Reviews;
