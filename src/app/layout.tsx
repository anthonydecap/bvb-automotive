import { PrismicPreview } from "@prismicio/next";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import { siteUrl } from "@/lib/metadata";
import { repositoryName } from "@/prismicio";

import "./globals.css";

/** Archivo with its width axis: set wide and slanted for the voice, upright and normal for reading. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export const viewport: Viewport = {
  themeColor: "#0a0b1d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-BE" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Entrance animations only hide content once script is known to run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body>
        {children}
        <PrismicPreview repositoryName={repositoryName} />
        <Analytics />
      </body>
    </html>
  );
}
