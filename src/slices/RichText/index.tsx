import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { RichText as Text } from "@/components/RichText";
import { Section } from "@/components/Section";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

const RichText = ({ slice }: RichTextProps) => (
  <Section slice={slice}>
    <div className="container-x">
      <Text field={slice.primary.text} className="prose-bvb mx-auto text-lg text-ink/85" />
    </div>
  </Section>
);

export default RichText;
