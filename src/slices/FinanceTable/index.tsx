import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { RichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type FinanceTableProps = SliceComponentProps<Content.FinanceTableSlice>;

/** Indicative monthly amounts per price: a real table, so it keeps its row lines. */
const FinanceTable = ({ slice }: FinanceTableProps) => {
  const p = slice.primary;

  return (
    <Section slice={slice}>
      <div className="frame">
        <SectionHeading title={p.title} intro={p.intro} align="split" />
        <div className="mt-12 bg-navy">
          <table className="tabular w-full text-left">
            <caption className="sr-only">Indicatieve maandbedragen per aankoopprijs</caption>
            <thead className="hidden bg-carbon text-gold sm:table-header-group">
              <tr>
                {["Aankoopprijs", "Aanbetaling", "Maandbedrag", "Totale kost"].map((h) => (
                  <th key={h} scope="col" className="px-6 py-4 text-small font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-2" /* taste-skill-ignore: rows of a real table */>
              {p.rows.map((row, i) => (
                <tr key={i} className="grid grid-cols-2 gap-y-3 p-5 sm:table-row sm:p-0">
                  <th scope="row" className="col-span-2 font-bold sm:px-6 sm:py-5">
                    {row.price}
                  </th>
                  <td className="sm:px-6 sm:py-5">
                    <span className="block text-small text-mist sm:hidden">Aanbetaling</span>
                    {row.down_payment}
                  </td>
                  <td className="sm:px-6 sm:py-5">
                    <span className="block text-small text-mist sm:hidden">Maandbedrag</span>
                    <strong className="font-bold text-gold">{row.monthly}</strong>
                    <span className="text-small"> per maand</span>
                  </td>
                  <td className="sm:px-6 sm:py-5">
                    <span className="block text-small text-mist sm:hidden">Totale kost</span>
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RichText field={p.note} className="prose-bvb mt-6 max-w-4xl text-small" />
      </div>
    </Section>
  );
};

export default FinanceTable;
