import { isFilled } from "@prismicio/client";
import Link from "next/link";

import { telHref, whatsappHref } from "@/lib/format";
import { href, navigation, type Settings, siteInfo } from "@/lib/site";

import { Img } from "./Img";
import { InlineRichText } from "./RichText";

/**
 * The close of every page: the back of the card. A chalk panel with a short sign-off and the address
 * lines, a photograph as its stamp; under it the full menu, then the name.
 */
export function Footer({ settings }: { settings: Settings }) {
  const site = siteInfo(settings);
  const nav = navigation(settings);
  const groups = nav.filter((g) => g.children.length);
  const singles = nav.filter((g) => !g.children.length);
  const extra = settings.data.footer_links
    .map((l) => ({ label: l.label, href: href(l.link) }))
    .filter((l): l is { label: string; href: string } => !!l.label && !!l.href);
  const stamp = settings.data.meta_image;
  const external = { target: "_blank", rel: "noopener noreferrer" };

  return (
    <footer className="bg-ink pt-[var(--section)] pb-8 text-chalk">
      <div className="frame">
        <div className="grid gap-10 bg-chalk p-6 text-ink sm:p-10 lg:grid-cols-2 lg:gap-8 lg:p-14">
          <div>
            <h2 className="heading">Tot in Geel</h2>
            <div className="mt-6 max-w-[40ch] space-y-4 text-body">
              <InlineRichText field={settings.data.footer_text} />
              {site.hoursNote && <p>{site.hoursNote}</p>}
            </div>
            {site.rating && site.reviewsHref && (
              <a href={site.reviewsHref} {...external} className="link mt-6 inline-block font-medium">
                {site.rating}/5 op {site.ratingSource}
              </a>
            )}
          </div>

          <div className="flex items-start justify-between gap-6">
            <ul className="grid gap-3 text-lead font-medium">
              {site.phone && (
                <li>
                  <a href={telHref(site.phone)} className="link tabular">
                    {site.phone}
                  </a>
                </li>
              )}
              {site.whatsapp && (
                <li>
                  <a href={whatsappHref(site.whatsapp)} {...external} className="link">
                    WhatsApp
                  </a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="link break-all">
                    {site.email}
                  </a>
                </li>
              )}
              {site.street && (
                <li>
                  <a href={site.mapsHref} {...external} className="link">
                    {site.street}, {site.city}
                  </a>
                </li>
              )}
              {(site.instagram || site.facebook) && (
                <li className="flex gap-6">
                  {site.instagram && (
                    <a href={site.instagram} {...external} className="link">
                      Instagram
                    </a>
                  )}
                  {site.facebook && (
                    <a href={site.facebook} {...external} className="link">
                      Facebook
                    </a>
                  )}
                </li>
              )}
            </ul>
            {isFilled.image(stamp) && (
              <div className="hidden shrink-0 bg-paper p-1.5 sm:block">
                <div className="relative aspect-[3/4] w-20 overflow-hidden lg:w-24">
                  <Img field={stamp} alt="" fill sizes="96px" className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        <nav aria-label="Voettekst" className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="text-body font-semibold">{group.label}</h2>
              <ul className="mt-4 grid gap-2 text-body text-fog">
                {group.children.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {singles.length > 0 && (
            <div>
              <h2 className="text-body font-semibold">BVB</h2>
              <ul className="mt-4 grid gap-2 text-body text-fog">
                {singles.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {extra.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      {...(/^https?:/.test(l.href) ? external : {})}
                      className="transition-colors hover:text-gold"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        <p className="display mt-20 text-display text-gold" aria-hidden="true">
          BVB Automotive
        </p>
        <p className="mt-8 text-small text-fog">
          © {new Date().getFullYear()} {site.name}
          {site.vatNumber ? `, ${site.vatNumber}` : ""}. Website door Anthony Decap.
        </p>
      </div>
    </footer>
  );
}
