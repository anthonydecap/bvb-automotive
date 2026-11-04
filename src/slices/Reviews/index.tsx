import type { Content } from "@prismicio/client";
import { asText, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { PrismicLink } from "@/components/PrismicLink";
import { RevCounter } from "@/components/RevCounter";
import type { SliceContext } from "@/lib/slice-context";

export type ReviewsProps = SliceComponentProps<Content.ReviewsSlice, SliceContext>;

const month = (value: string | null | undefined) =>
  value ? new Intl.DateTimeFormat("nl-BE", { month: "long", year: "numeric" }).format(new Date(value)) : "";

/** What buyers wrote, beside the score on a rev counter. */
const Reviews = ({ slice, context }: ReviewsProps) => {
  const p = slice.primary;
  const s = context.settings.data;
  const own = p.items.filter((r) => isFilled.richText(r.quote));
  const list = own.length ? own : s.reviews.filter((r) => isFilled.richText(r.quote));
  const reviews = list.slice(0, 6).map((r) => ({
    quote: asText(r.quote),
    name: r.name || "Klant via AutoScout24",
    date: month(r.date),
  }));
  const score = parseFloat((s.rating ?? "5").replace(",", ".")) || 5;

  return (
    <section data-slice-type={slice.slice_type} className="sec bg-navy text-chalk">
      <div className="frame">
        <RevCounter score={score} label={`op ${s.rating_source ?? "AutoScout24"}`} reviews={reviews} />
        {isFilled.link(p.button_link) && (
          <div className="mt-10 lg:ml-[calc(5/12*100%+clamp(2rem,5vw,6rem))]">
            <PrismicLink field={p.button_link} className="link">
              {p.button_label || "Alle reviews"}
            </PrismicLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
