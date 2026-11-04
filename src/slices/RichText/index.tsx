import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { RichText as Text } from "@/components/RichText";
import { Section } from "@/components/Section";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/** Long-form text, set on the grid's third column so it shares an edge with the headings around it. */
const RichText = ({ slice }: RichTextProps) => (
  <Section slice={slice}>
    <div className="frame grid lg:grid-cols-12">
      <Text field={slice.primary.text} className="prose-bvb text-body lg:col-span-7 lg:col-start-3" />
    </div>
  </Section>
);

export default RichText;
