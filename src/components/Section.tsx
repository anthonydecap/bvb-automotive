import type { CSSProperties, ReactNode } from "react";

type SectionProps = {
  tone?: "Licht" | "Donker" | "Wit" | null;
  className?: string;
  id?: string;
  slice?: { slice_type: string; variation: string };
  style?: CSSProperties;
  children: ReactNode;
};

/** The CMS tones, on the night palette: "Licht" is night, "Donker" the brand navy, "Wit" one step between. */
export const toneClass = (tone: SectionProps["tone"]) =>
  tone === "Donker" ? "bg-navy" : tone === "Wit" ? "bg-carbon" : "bg-night";

export function Section({ tone = "Licht", className = "", id, slice, style, children }: SectionProps) {
  return (
    <section
      id={id}
      data-slice-type={slice?.slice_type}
      data-slice-variation={slice?.variation}
      data-tone={tone === "Donker" ? "navy" : tone === "Wit" ? "carbon" : "night"}
      className={`${toneClass(tone)} sec relative text-chalk ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}
