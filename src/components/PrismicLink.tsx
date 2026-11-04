import { PrismicNextLink } from "@prismicio/next";
import type { ComponentProps } from "react";

import { linkResolver } from "@/lib/routes";

/** PrismicNextLink with the site's link resolver. */
export function PrismicLink(props: ComponentProps<typeof PrismicNextLink>) {
  return <PrismicNextLink linkResolver={linkResolver} {...props} />;
}
