import type { CSSProperties, ReactNode } from "react";

type SectionProps = {
  tone?: "Licht" | "Donker" | "Wit" | null;
  className?: string;
  id?: string;
  slice?: { slice_type: string; variation: string };
  style?: CSSProperties;
  children: ReactNode;
};

export const toneClass = (tone: SectionProps["tone"]) =>
  tone === "Donker" ? "bg-ink text-chalk" : tone === "Wit" ? "bg-chalk text-ink" : "bg-paper text-ink";

/** A full-width page section on the ground, the white step or the ink field. */
export function Section({ tone = "Licht", className = "", id, slice, style, children }: SectionProps) {
  return (
    <section
      id={id}
      data-slice-type={slice?.slice_type}
      data-slice-variation={slice?.variation}
      data-tone={tone === "Donker" ? "dark" : "light"}
      className={`${toneClass(tone)} section relative ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}
