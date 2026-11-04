import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { RichText } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type FinanceTableProps = SliceComponentProps<Content.FinanceTableSlice>;

const FinanceTable = ({ slice }: FinanceTableProps) => {
  const p = slice.primary;

  return (
    <Section slice={slice}>
      <div className="container-x">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} align="split" />
        <div className="mt-12 overflow-hidden rounded-md border border-bone bg-white">
          <table className="tabular w-full text-left">
            <caption className="sr-only">Indicatieve maandbedragen per aankoopprijs</caption>
            <thead className="hidden bg-ink text-white sm:table-header-group">
              <tr>
                {["Aankoopprijs", "Aanbetaling", "Maandbedrag", "Totale kost"].map((h, i) => (
                  <th key={h} scope="col" className={`spec-label px-6 py-4 font-medium ${i === 2 ? "text-gold" : "text-mist"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-bone">
              {p.rows.map((row, i) => (
                <tr key={i} className="grid grid-cols-2 gap-y-3 p-5 sm:table-row sm:p-0">
                  <th scope="row" className="col-span-2 text-2xl font-bold sm:px-6 sm:py-5 sm:text-lg">
                    {row.price}
                  </th>
                  <td className="sm:px-6 sm:py-5">
                    <span className="spec-label block text-stone sm:hidden">Aanbetaling</span>
                    {row.down_payment}
                  </td>
                  <td className="sm:px-6 sm:py-5">
                    <span className="spec-label block text-stone sm:hidden">Maandbedrag</span>
                    <strong className="text-lg text-gold-deep sm:text-xl">{row.monthly}</strong>
                    <span className="text-sm text-stone"> /maand</span>
                  </td>
                  <td className="sm:px-6 sm:py-5">
                    <span className="spec-label block text-stone sm:hidden">Totale kost</span>
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RichText field={p.note} className="prose-bvb mt-6 max-w-4xl text-sm text-stone" />
      </div>
    </Section>
  );
};

export default FinanceTable;
