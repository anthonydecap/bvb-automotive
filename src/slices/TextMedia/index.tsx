import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ButtonRow } from "@/components/ButtonLink";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type TextMediaProps = SliceComponentProps<Content.TextMediaSlice>;

const TextMedia = ({ slice }: TextMediaProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";
  const hasImage = isFilled.image(p.image);
  const left = p.image_position === "Links";
  const body = (
    <>
      <RichText
        field={p.text}
        className={`prose-bvb text-[1.0625rem] leading-relaxed ${dark ? "text-fog [&_strong]:text-white" : "text-ink/80 [&_strong]:text-ink"}`}
      />
      <ButtonRow buttons={p.buttons} className="mt-9" />
    </>
  );

  if (!hasImage) {
    return (
      <Section slice={slice} tone={p.tone}>
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} dark={dark} />
          </div>
          <Reveal className="lg:col-span-7 lg:pt-12">{body}</Reveal>
        </div>
      </Section>
    );
  }

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal className={`lg:col-span-6 ${left ? "lg:order-2" : ""}`}>
          <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} dark={dark} />
          <div className="mt-8">{body}</div>
        </Reveal>
        <Reveal delay={120} className={`lg:col-span-6 ${left ? "lg:order-1" : ""}`}>
          <div className="relative">
            <div
              className={`absolute -inset-3 -z-0 hidden rounded-lg border lg:block ${
                dark ? "border-gold/25" : "border-gold-deep/20"
              } ${left ? "translate-x-6 translate-y-6" : "-translate-x-6 translate-y-6"}`}
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-graphite">
              <Img field={p.image} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};

export default TextMedia;
