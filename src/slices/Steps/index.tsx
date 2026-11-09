import type { Content } from "@prismicio/client";
import { asText, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Img } from "@/components/Img";
import { ProcessTrack } from "@/components/ProcessTrack";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { InlineRichText, RichText, Title } from "@/components/RichText";

export type StepsProps = SliceComponentProps<Content.StepsSlice>;

/** The stages, on a stage that runs sideways while the page scrolls. Order is carried by the run itself. */
const Steps = ({ slice }: StepsProps) => {
  const p = slice.primary;

  // Without photographs there is nothing to run past: the steps stand in a grid, and a gold bar
  // that fills further at each step carries the order.
  if (!p.items.some((step) => isFilled.image(step.image))) {
    const n = p.items.length;
    return (
      <section data-slice-type={slice.slice_type} className="sec bg-night text-chalk" data-tone="night">
        <div className="frame">
          <SectionHeading title={p.title} intro={p.intro} />
          <ol className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 ${n % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
            {p.items.map((step, i) => (
              <Reveal as="li" key={i}>
                <div className="h-[3px] bg-navy-2" aria-hidden="true">
                  <div className="h-full bg-gold" style={{ width: `${((i + 1) / n) * 100}%` }} />
                </div>
                <h3 className="speed-item mt-6">{step.title}</h3>
                <RichText field={step.text} className="prose-bvb mt-4 text-mist" />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <ProcessTrack label={asText(p.title) || "Werkwijze"}>
      <Reveal className="process-intro">
        <Title field={p.title} className="speed head" />
        {isFilled.richText(p.intro) && (
          <div className="lead mt-6 text-mist">
            <InlineRichText field={p.intro} />
          </div>
        )}
      </Reveal>
      {p.items.map((step, i) => {
        const photo = isFilled.image(step.image);
        return (
          <article key={i} className={`step ${photo ? "" : "no-photo"}`}>
            {photo && (
              <div className="step-photo">
                <Img
                  field={step.image}
                  fill
                  sizes="(min-width: 1920px) 653px, (min-width: 900px) 34vw, 92vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="speed">{step.title}</h3>
              <RichText field={step.text} className="prose-bvb mt-5 max-w-[30rem]" />
            </div>
          </article>
        );
      })}
    </ProcessTrack>
  );
};

export default Steps;
