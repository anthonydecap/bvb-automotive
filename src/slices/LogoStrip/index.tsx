import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Img } from "@/components/Img";
import { PrismicLink } from "@/components/PrismicLink";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type LogoStripProps = SliceComponentProps<Content.LogoStripSlice>;

const LogoStrip = ({ slice }: LogoStripProps) => {
  const p = slice.primary;
  const dark = p.tone === "Donker";

  return (
    <Section slice={slice} tone={p.tone} className="!py-16 lg:!py-20">
      <div className="container-x">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} dark={dark} align="split" />
        <ul
          className={`mt-12 grid grid-cols-2 border-t border-l sm:grid-cols-3 ${
            ({ 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" } as Record<number, string>)[p.items.length] ??
            (p.items.length > 5 ? "lg:grid-cols-6" : "lg:grid-cols-3")
          } ${dark ? "border-white/10" : "border-ink/10"}`}
        >
          {p.items.map((item, i) => {
            const logo = (
              <Img
                field={item.logo}
                alt={item.name ?? ""}
                sizes="200px"
                className={`max-h-12 w-auto max-w-[70%] object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${
                  dark ? "brightness-0 invert" : "brightness-0"
                }`}
              />
            );
            return (
              <li key={i} className={`group border-r border-b ${dark ? "border-white/10" : "border-ink/10"}`}>
                {isFilled.link(item.link) ? (
                  <PrismicLink field={item.link} className="flex h-32 items-center justify-center px-6">
                    {logo}
                  </PrismicLink>
                ) : (
                  <div className="flex h-32 items-center justify-center px-6">{logo}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
};

export default LogoStrip;
