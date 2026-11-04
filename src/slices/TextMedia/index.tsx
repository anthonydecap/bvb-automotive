import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ButtonRow } from "@/components/ButtonLink";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type TextMediaProps = SliceComponentProps<Content.TextMediaSlice>;

/** A story beside one large picture; without a picture the heading and text share the width. */
const TextMedia = ({ slice }: TextMediaProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";
  const hasImage = isFilled.image(p.image);
  const left = p.image_position === "Links";
  const muted = dark ? "text-fog" : "";

  const text = (
    <>
      {isFilled.richText(p.intro) && (
        <div className={`text-lead ${muted}`}>
          <InlineRichText field={p.intro} />
        </div>
      )}
      <RichText
        field={p.text}
        className={`prose-bvb text-body ${muted} ${dark ? "[&_strong]:text-chalk" : ""}`}
      />
      <ButtonRow buttons={p.buttons} className="pt-4" />
    </>
  );

  if (!hasImage) {
    return (
      <Section slice={slice} tone={p.tone}>
        <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <Title field={p.title} className="heading" />
          </Reveal>
          <Reveal className="space-y-6 lg:col-span-5 lg:col-start-8 lg:pt-3">{text}</Reveal>
        </div>
      </Section>
    );
  }

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="frame grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className={`space-y-6 lg:col-span-5 ${left ? "lg:order-2 lg:col-start-8" : ""}`}>
          <Title field={p.title} className="heading" />
          {text}
        </Reveal>
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-graphite lg:col-span-7 lg:aspect-[5/4] ${
            left ? "lg:order-1" : "lg:col-start-6"
          }`}
        >
          <Img field={p.image} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
        </div>
      </div>
    </Section>
  );
};

export default TextMedia;
