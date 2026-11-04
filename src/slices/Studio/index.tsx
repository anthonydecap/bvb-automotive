import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Arrow } from "@/components/Icons";
import { Img } from "@/components/Img";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { StudioRoom } from "@/components/StudioRoom";

export type StudioProps = SliceComponentProps<Content.StudioSlice>;

/** The detailing studio: the lights come on, then the big photograph, the services and the certificate. */
const Studio = ({ slice }: StudioProps) => {
  const p = slice.primary;
  // The last two services of five (or the last of four) get a wider tile, so rows close cleanly.
  const n = p.items.length;
  const wide = (i: number) => (n % 3 === 2 && i >= n - 2) || (n % 3 === 1 && i === n - 1);

  return (
    <StudioRoom
      title={<Title field={p.title} className="speed head" />}
      intro={<InlineRichText field={p.intro} />}
    >
      <div className="services">
        {isFilled.image(p.image) && (
          <Reveal as="figure" className="svc-hero">
            <Img field={p.image} fill sizes="100vw" className="object-cover object-[50%_35%]" />
            {p.caption && <figcaption>{p.caption}</figcaption>}
          </Reveal>
        )}
        {p.items.map((item, i) => (
          <Reveal as="article" key={i} className={`svc ${wide(i) ? "wide" : ""}`}>
            <div className="svc-photo">
              <Img field={item.image} fill sizes="(min-width: 900px) 40vw, 92vw" className="object-cover" />
            </div>
            <div>
              <h3 className="speed">{item.title}</h3>
              <RichText field={item.text} />
            </div>
          </Reveal>
        ))}
        {(isFilled.image(p.badge) || p.badge_text || isFilled.link(p.button_link)) && (
          <Reveal className="gyeon">
            {isFilled.image(p.badge) && <Img field={p.badge} sizes="12rem" className="h-9 w-auto" />}
            {p.badge_text && <p>{p.badge_text}</p>}
            {isFilled.link(p.button_link) && (
              <PrismicLink field={p.button_link} className="btn btn-gold">
                {p.button_label || "Vraag een offerte"}
                <Arrow />
              </PrismicLink>
            )}
          </Reveal>
        )}
      </div>
    </StudioRoom>
  );
};

export default Studio;
