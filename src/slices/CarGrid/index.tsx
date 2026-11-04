import type { Content } from "@prismicio/client";
import { asText, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { CarExplorer } from "@/components/CarExplorer";
import { PrismicLink } from "@/components/PrismicLink";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SoldLedger } from "@/components/SoldLedger";
import { type Car, isSold, summarize } from "@/lib/cars";
import { getCars } from "@/lib/content";

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

  const heading = asText(p.title);

  if (sold) {
    return (
      <section data-slice-type={slice.slice_type} id="verkocht" className="bg-paper py-[var(--section)]">
        <div className="frame">
          <SoldLedger cars={cars} title={heading || "Al vertrokken"} />
        </div>
      </section>
    );
  }

  return (
    <Section slice={slice} id="wagens" className={isFilled.richText(p.title) ? "" : "!pt-10 lg:!pt-14"}>
      <div className="frame">
        {(isFilled.richText(p.title) || isFilled.link(p.button_link)) && (
          <Reveal className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
            <Title field={p.title} className="heading lg:col-span-7" />
            <div className="space-y-6 lg:col-span-4 lg:col-start-9">
              {isFilled.richText(p.intro) && (
                <div className="space-y-4 text-body">
                  <InlineRichText field={p.intro} />
                </div>
              )}
              {isFilled.link(p.button_link) && (
                <PrismicLink field={p.button_link} className="link font-medium">
                  {p.button_label || "Bekijk alles"}
                </PrismicLink>
              )}
            </div>
          </Reveal>
        )}
        <CarExplorer cars={cars} showFilters={p.show_filters} showSold={p.show_sold} />
      </div>
    </Section>
  );
};

export default CarGrid;
