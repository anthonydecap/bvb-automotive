import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Reveal } from "@/components/Reveal";
import { InlineRichText, RichText, Title } from "@/components/RichText";
import { Section } from "@/components/Section";

export type FinanceTableProps = SliceComponentProps<Content.FinanceTableSlice>;

/** Indicative monthly amounts per price, as a plain table: the monthly amount is the one that leads. */
const FinanceTable = ({ slice }: FinanceTableProps) => {
  const p = slice.primary;
  const cell = "py-4 text-right";

  return (
    <Section slice={slice}>
      <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="space-y-5 lg:col-span-4">
          <Title field={p.title} className="speed text-[clamp(1.5rem,1rem+1.6vw,2.6rem)]" />
          {isFilled.richText(p.intro) && (
            <div className="space-y-3 text-mist">
              <InlineRichText field={p.intro} />
            </div>
          )}
        </Reveal>

        <div className="lg:col-span-8 lg:col-start-5">
          <table className="tabular w-full">
            <caption className="sr-only">Indicatieve maandbedragen per aankoopprijs</caption>
            <thead className="text-small text-mist">
              <tr className="border-b border-chalk/20" /* taste-skill-ignore: header rule of a real table */>
                <th scope="col" className="pb-3 text-left font-medium">
                  Aankoopprijs
                </th>
                <th scope="col" className="hidden pb-3 text-right font-medium sm:table-cell">
                  Aanbetaling
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Per maand
                </th>
                <th scope="col" className="hidden pb-3 text-right font-medium sm:table-cell">
                  Totale kost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-2" /* taste-skill-ignore: rows of a real table */>
              {p.rows.map((row, i) => (
                <tr key={i}>
                  <th scope="row" className="py-4 text-left font-semibold">
                    {row.price}
                    <span className="mt-0.5 block text-small font-normal text-mist sm:hidden">
                      {row.down_payment} aanbetaling, {row.total} totaal
                    </span>
                  </th>
                  <td className={`${cell} hidden text-mist sm:table-cell`}>{row.down_payment}</td>
                  <td className={`${cell} text-lead font-semibold`}>{row.monthly}</td>
                  <td className={`${cell} hidden text-mist sm:table-cell`}>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <RichText
            field={p.note}
            className="prose-bvb mt-6 max-w-none text-small text-mist [&_strong]:text-chalk"
          />
        </div>
      </div>
    </Section>
  );
};

export default FinanceTable;
