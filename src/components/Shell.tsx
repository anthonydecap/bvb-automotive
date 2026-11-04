import type { ReactNode } from "react";

import { getSettings } from "@/lib/content";
import { href, navigation, siteInfo } from "@/lib/site";

import { Footer } from "./Footer";
import { Header } from "./Header";

/** Page frame: header, main landmark and footer, driven by the Settings document. */
export async function Shell({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const ctaHref = href(settings.data.header_cta);
  const cta = ctaHref ? { href: ctaHref, label: settings.data.header_cta.text || "Contact" } : undefined;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Naar de inhoud
      </a>
      <Header nav={navigation(settings)} cta={cta} site={siteInfo(settings)} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
