import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ButtonRow } from "@/components/ButtonLink";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type TextMediaProps = SliceComponentProps<Content.TextMediaSlice>;

/** A story beside one large photograph; without a photograph the title and text share the width. */
const TextMedia = ({ slice }: TextMediaProps) => {
  const p = slice.primary;
  const hasImage = isFilled.image(p.image);
  const left = p.image_position === "Links";

  const text = (
    <>
      <Title field={p.title} className="speed text-[clamp(1.5rem,1rem+1.6vw,2.6rem)]" />
      {isFilled.richText(p.intro) && (
        <div className="lead text-mist">
          <InlineRichText field={p.intro} />
        </div>
      )}
      <RichText field={p.text} className="prose-bvb text-mist [&_strong]:text-chalk" />
      <ButtonRow buttons={p.buttons} className="pt-2" />
    </>
  );

  if (!hasImage) {
    return (
      <Section slice={slice} tone={p.tone}>
        <Reveal className="frame grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Title field={p.title} className="speed text-[clamp(1.5rem,1rem+1.6vw,2.6rem)] lg:col-span-6" />
          <div className="space-y-6 lg:col-span-5 lg:col-start-8">
            <RichText field={p.text} className="prose-bvb text-mist [&_strong]:text-chalk" />
            <ButtonRow buttons={p.buttons} />
          </div>
        </Reveal>
      </Section>
    );
  }

  return (
    <Section slice={slice} tone={p.tone}>
      <div className="frame grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className={`space-y-6 lg:col-span-5 ${left ? "lg:order-2 lg:col-start-8" : ""}`}>
          {text}
        </Reveal>
        <div
          className={`group relative aspect-[4/3] overflow-hidden bg-navy lg:col-span-7 lg:aspect-[5/4] ${
            left ? "lg:order-1" : "lg:col-start-6"
          }`}
        >
          <Img
            field={p.image}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </Section>
  );
};

export default TextMedia;
