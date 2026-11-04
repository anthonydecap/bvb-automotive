import { PrismicPreview } from "@prismicio/next";
import type { Metadata, Viewport } from "next";

import { siteUrl } from "@/lib/metadata";
import { repositoryName } from "@/prismicio";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export const viewport: Viewport = {
  themeColor: "#111214",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-BE" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/GeneralSans-400.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/GeneralSans-700.woff2" as="font" type="font/woff2" crossOrigin="" />
        {/* Entrance animations only hide content once script is known to run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body>
        {children}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
