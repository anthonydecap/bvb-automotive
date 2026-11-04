import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";

import { CarExplorer } from "@/components/CarExplorer";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";
import { CarRow } from "@/components/CarRow";
import { Arrow } from "@/components/Icons";
import { Lanes } from "@/components/Lanes";
import { type Car, isSold, summarize } from "@/lib/cars";
import { getCars } from "@/lib/content";
import { href } from "@/lib/site";

export type CarGridProps = SliceComponentProps<Content.CarGridSlice>;

function select(cars: Car[], selection: Content.CarGridSlice["primary"]["selection"]) {
  switch (selection) {
    case "Uitgelicht": {
      const featured = cars.filter((c) => c.data.featured && !isSold(c));
      return featured.length ? featured : cars.filter((c) => !isSold(c));
    }
    case "VAG":
    case "BMW & Mini":
    case "Premium & Performance":
      return cars.filter((c) => summarize(c).collections.includes(selection));
    case "Recent verkocht":
      return cars.filter(isSold);
    default:
      return cars;
  }
}

const CarGrid = async ({ slice }: CarGridProps) => {
  const p = slice.primary;
  const all = await getCars();
  let cars = select(all, p.selection).map(summarize);
  const sold = p.selection === "Recent verkocht";
  if (p.limit) {
    const forSale = cars.filter((c) => c.status !== "Verkocht").slice(0, p.limit);
    cars = sold ? cars.slice(0, p.limit) : [...forSale, ...cars.filter((c) => c.status === "Verkocht")];
  }

  const moreHref = isFilled.link(p.button_link) ? href(p.button_link) : undefined;

  // The sold cars, as two lanes passing in opposite directions.
  if (sold) {
    return (
      <section
        data-slice-type={slice.slice_type}
        id="verkocht"
        className="sec overflow-hidden bg-night text-chalk"
      >
        <Reveal className="frame sec-head">
          {isFilled.richText(p.title) ? (
            <Title field={p.title} className="speed head" />
          ) : (
            <h2 className="speed head">Sleutels overhandigd</h2>
          )}
          <div className="grid justify-items-start gap-6">
            <div className="lead text-mist">
              {isFilled.richText(p.intro) ? (
                <InlineRichText field={p.intro} />
              ) : (
                <p>
                  Al deze wagens stonden ooit op onze parking in Geel. Vandaag rijden ze bij een nieuwe
                  eigenaar.
                </p>
              )}
            </div>
            <Link href={moreHref ?? "/contact"} className="btn btn-gold">
              {p.button_label || "Zoekt u er zo één?"}
              <Arrow />
            </Link>
          </div>
        </Reveal>
        <Lanes cars={cars} />
      </section>
    );
  }

  // Without filters: the stock as a row to drag, edge to edge.
  if (!p.show_filters) {
    return (
      <section
        data-slice-type={slice.slice_type}
        id="wagens"
        className="sec overflow-hidden bg-night text-chalk"
      >
        <Reveal className="frame sec-head">
          <Title field={p.title} className="speed head" />
          {isFilled.richText(p.intro) && (
            <div className="lead text-mist">
              <InlineRichText field={p.intro} />
            </div>
          )}
        </Reveal>
        <CarRow
          cars={cars.filter((c) => c.status !== "Verkocht")}
          moreHref={moreHref}
          end={
            <>
              <p className="lead font-bold">Niet gevonden wat u zoekt?</p>
              <p className="text-mist">We zoeken mee of importeren op aanvraag.</p>
            </>
          }
        />
      </section>
    );
  }

  return (
    <Section slice={slice} id="wagens" className={isFilled.richText(p.title) ? "" : "!pt-10 lg:!pt-14"}>
      <div className="frame">
        {isFilled.richText(p.title) && (
          <Reveal className="sec-head">
            <Title field={p.title} className="speed head" />
            {isFilled.richText(p.intro) && (
              <div className="lead text-mist">
                <InlineRichText field={p.intro} />
              </div>
            )}
          </Reveal>
        )}
        <CarExplorer cars={cars} showFilters={p.show_filters} showSold={p.show_sold} />
      </div>
    </Section>
  );
};

export default CarGrid;
