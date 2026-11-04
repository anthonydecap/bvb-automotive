import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import type { CSSProperties } from "react";

import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";

export type StatsProps = SliceComponentProps<Content.StatsSlice>;

/** The dashboard: a few figures, large and slanted, that count up as they arrive. */
const Stats = ({ slice }: StatsProps) => {
  const p = slice.primary;
  const dark = p.tone !== "Donker";

  return (
    <section
      data-slice-type={slice.slice_type}
      className={`numbers sec text-chalk ${dark ? "bg-navy" : "bg-night"}`}
    >
      <h2 className="sr-only">In cijfers</h2>
      <Reveal as="dl" className="frame" style={{ "--n": Math.min(4, p.items.length) } as CSSProperties}>
        {p.items.map((item, i) => (
          <div key={i}>
            <dt className="lead">{item.label}</dt>
            <dd
              className={`speed ${/^\D*\d/.test(item.value ?? "") ? "n" : "text-[clamp(1.6rem,1rem+1.8vw,3rem)]"}`}
            >
              <CountUp value={item.value ?? ""} />
            </dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
};

export default Stats;
