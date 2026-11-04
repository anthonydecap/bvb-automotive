import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { formatDate } from "@/lib/format";
import type { SliceContext } from "@/lib/slice-context";

export type ReviewsProps = SliceComponentProps<Content.ReviewsSlice, SliceContext>;

/** Each slip has its own tilt and length, so the row reads as handed-over paper, not a grid. */
const slips = [
  "lg:-rotate-[4deg] lg:mt-6",
  "lg:rotate-[2deg] lg:mt-20",
  "lg:rotate-[5deg] lg:mt-2",
  "lg:-rotate-[2deg] lg:mt-16",
];
const phone = [
  "max-lg:-rotate-2 max-lg:mr-auto",
  "max-lg:rotate-2 max-lg:ml-auto",
  "max-lg:-rotate-1 max-lg:mr-auto",
  "max-lg:rotate-3 max-lg:ml-auto",
];

/** What buyers wrote, as torn paper slips fanned across a field of Lapiz Blue. */
const Reviews = ({ slice, context }: ReviewsProps) => {
  const p = slice.primary;
  const s = context.settings.data;
  const own = p.items.filter((r) => isFilled.richText(r.quote));
  const reviews = (own.length ? own : s.reviews.filter((r) => isFilled.richText(r.quote))).slice(0, 4);

  return (
    <section data-slice-type={slice.slice_type} className="section overflow-hidden bg-[#1f4c9c] text-chalk">
      <div className="frame">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Title field={p.title} className="heading lg:col-span-7" />
          <div className="space-y-5 text-body lg:col-span-4 lg:col-start-9">
            <InlineRichText field={p.intro} />
            {isFilled.link(p.button_link) && (
              <PrismicLink field={p.button_link} className="link inline-block font-medium">
                {p.button_label || "Alle reviews"}
              </PrismicLink>
            )}
          </div>
        </Reveal>

        <Reveal
          as="ul"
          className="mt-14 flex flex-col lg:mt-20 lg:flex-row lg:items-start lg:justify-center lg:px-[8%]"
        >
          {reviews.map((r, i) => (
            <li
              key={i}
              className={`slip w-[82%] bg-chalk px-6 pt-9 pb-10 text-ink sm:w-[60%] lg:-mx-3 lg:w-auto lg:max-w-[20rem] lg:flex-1 ${phone[i % 4]} ${slips[i % 4]} ${
                i > 0 ? "max-lg:-mt-8" : ""
              }`}
              style={{ zIndex: i + 1 }}
            >
              <p className="text-center text-lead font-semibold">{r.name || "Klant via AutoScout24"}</p>
              {r.date && <p className="mt-1 text-center text-small text-stone">{formatDate(r.date)}</p>}
              <blockquote className="mt-6 text-body">
                <InlineRichText field={r.quote} />
              </blockquote>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default Reviews;
