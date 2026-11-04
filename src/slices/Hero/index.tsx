import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ButtonRow } from "@/components/ButtonLink";
import { HeroLineup } from "@/components/HeroLineup";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { isSold, summarize } from "@/lib/cars";
import { getCars } from "@/lib/content";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero = async ({ slice, index }: HeroProps) => {
  const p = slice.primary;
  const first = index === 0;
  const Heading = first ? "h1" : "h2";

  if (slice.variation !== "page") {
    const stock = (await getCars()).filter((c) => !isSold(c)).map(summarize);
    if (stock.length) {
      return (
        <HeroLineup
          cars={stock}
          title={<Title field={p.title} as={Heading} className="display max-w-[15ch] text-display" />}
          lead={
            <>
              {isFilled.richText(p.intro) && (
                <div className="text-body">
                  <InlineRichText field={p.intro} />
                </div>
              )}
              <ButtonRow buttons={p.buttons} className="mt-6" />
            </>
          }
          facts={p.stats.filter((s) => s.value && s.label).map((s) => ({ value: s.value!, label: s.label! }))}
        />
      );
    }
  }

  // Inner pages, or the home page with nothing in stock: the headline beside one large picture.
  const hasImage = isFilled.image(p.image);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`relative bg-ink text-chalk ${first ? "pt-28 lg:pt-32" : "pt-[var(--section)]"} pb-[var(--margin)]`}
    >
      <div
        className={`frame grid gap-10 lg:grid-cols-12 lg:gap-8 ${hasImage ? "lg:min-h-[calc(100svh-9rem)]" : "pb-[var(--section)]"}`}
      >
        {!hasImage && (
          <>
            <Reveal className="pt-6 lg:col-span-7 lg:pt-10">
              <Title field={p.title} as={Heading} className="display max-w-[14ch] text-display" />
            </Reveal>
            <Reveal className="space-y-6 lg:col-span-4 lg:col-start-9 lg:self-end">
              {isFilled.richText(p.intro) && (
                <div className="space-y-4 text-body text-fog">
                  <InlineRichText field={p.intro} />
                </div>
              )}
              <ButtonRow buttons={p.buttons} />
            </Reveal>
          </>
        )}
        {hasImage && (
          <Reveal className="flex flex-col pt-6 lg:col-span-6 lg:pb-8 lg:pt-10">
            <Title field={p.title} as={Heading} className="display max-w-[14ch] text-display" />
            {isFilled.richText(p.intro) && (
              <div className="mt-8 max-w-[46ch] space-y-4 text-body text-fog lg:text-lead lg:text-fog">
                <InlineRichText field={p.intro} />
              </div>
            )}
            <ButtonRow buttons={p.buttons} className="mt-10" />
            {p.stats.length > 0 && (
              <dl className="mt-auto grid grid-cols-2 gap-x-8 gap-y-5 pt-12 sm:grid-cols-4 lg:grid-cols-2">
                {p.stats.map((stat, i) => (
                  <div key={i}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-lead font-semibold text-gold">{stat.value}</span>
                      <span className="block text-small text-fog">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        )}
        {hasImage && (
          <div className="relative aspect-[4/3] overflow-hidden bg-graphite lg:col-span-6 lg:aspect-auto">
            <Img
              field={p.image}
              fill
              priority={first}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="slow-zoom object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
