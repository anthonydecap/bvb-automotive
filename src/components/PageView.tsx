import type { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { getSettings } from "@/lib/content";
import { components } from "@/slices";

import { Shell } from "./Shell";

/** A page document rendered as a slice zone inside the site frame. */
export async function PageView({ page }: { page: Content.PageDocument }) {
  const settings = await getSettings();
  return (
    <Shell>
      <SliceZone slices={page.data.slices} components={components} context={{ settings }} />
    </Shell>
  );
}
