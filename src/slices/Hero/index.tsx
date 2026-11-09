import type { Content } from "@prismicio/client";
import { asText, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ButtonRow } from "@/components/ButtonLink";
import { HeroOpen } from "@/components/HeroOpen";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { InlineRichText } from "@/components/RichText";
import { Ticker } from "@/components/Ticker";
import { getCars } from "@/lib/content";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/** The headline split into words, so each one can arrive on its own. */
function Words({ text, as: Tag, className }: { text: string; as: "h1" | "h2"; className: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={`rush ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

const Hero = async ({ slice, index }: HeroProps) => {
  const p = slice.primary;
  const first = index === 0;
  const Heading = first ? "h1" : "h2";
  const title = asText(p.title);

  if (slice.variation !== "page") {
    // The models that pass through BVB, for the ticker under the first screen.
    const models = [...new Set((await getCars()).map((c) => c.data.model).filter((m): m is string => !!m))];
    return (
      <>
        <HeroOpen
          photo={<Img field={p.image} fill priority={first} sizes="(min-width: 1920px) 1920px, 100vw" />}
          caption={
            isFilled.keyText(p.eyebrow) ? (
              <p className="lead font-bold italic [font-stretch:115%] uppercase">{p.eyebrow}</p>
            ) : undefined
          }
        >
          <Words text={title} as={Heading} className="speed mega max-w-[12ch]" />
          <div className="grid max-w-[34rem] gap-7">
            {isFilled.richText(p.intro) && (
              <div className="lead">
                <InlineRichText field={p.intro} />
              </div>
            )}
            <ButtonRow buttons={p.buttons} />
          </div>
        </HeroOpen>
        <Ticker names={models.slice(0, 10)} />
      </>
    );
  }

  const hasImage = isFilled.image(p.image);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`relative bg-night text-chalk ${hasImage ? "page-hero" : ""}`}
    >
      {hasImage && (
        <Img
          field={p.image}
          fill
          priority={first}
          sizes="(min-width: 1920px) 1920px, 100vw"
          className="object-cover"
        />
      )}
      <div
        className={`frame relative z-10 w-full pb-[clamp(3rem,7cqw,6rem)] ${hasImage ? "pt-40" : "pt-40 lg:pt-48"}`}
      >
        <Words text={title} as={Heading} className="speed page-title" />
        <Reveal className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          {isFilled.richText(p.intro) && (
            <div className="lead max-w-[42ch] lg:col-span-7">
              <InlineRichText field={p.intro} />
            </div>
          )}
          <div className="lg:col-span-5 lg:justify-self-end">
            <ButtonRow buttons={p.buttons} />
          </div>
        </Reveal>
        {p.stats.length > 0 && (
          <dl className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {p.stats.map((stat, i) => (
              <div key={i} className="flex flex-col-reverse">
                <dt className="mt-2 text-small text-mist">{stat.label}</dt>
                <dd className="speed text-[clamp(1.75rem,1rem+2cqw,3rem)] text-gold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};

export default Hero;
