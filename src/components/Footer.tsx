import Link from "next/link";

import { telHref, whatsappHref } from "@/lib/format";
import { href, navigation, type Settings, siteInfo } from "@/lib/site";

import { Logo } from "./Logo";
import { InlineRichText } from "./RichText";

/** A calm close: who and where on the left, the menu in columns, a quiet line at the bottom. */
export function Footer({ settings }: { settings: Settings }) {
  const site = siteInfo(settings);
  const nav = navigation(settings);
  const groups = nav.filter((g) => g.children.length);
  const singles = nav.filter((g) => !g.children.length);
  const inMenu = new Set(nav.flatMap((g) => [g.href, ...g.children.map((c) => c.href)]));
  // Footer links that are not already in the menu or the score link, so nothing appears twice.
  const extra = settings.data.footer_links
    .map((l) => ({ label: l.label, href: href(l.link) }))
    .filter(
      (l): l is { label: string; href: string } =>
        !!l.label && !!l.href && !inMenu.has(l.href) && l.href !== site.reviewsHref,
    );
  const external = { target: "_blank", rel: "noopener noreferrer" };
  const columns = [
    ...groups.map((g) => ({ label: g.label, links: g.children })),
    ...(singles.length ? [{ label: "Meer", links: singles }] : []),
  ];
  const link = "transition-colors hover:text-chalk";

  return (
    <footer className="bg-night text-small text-mist">
      <div className="frame grid gap-x-10 gap-y-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)] lg:py-20">
        <div className="space-y-5">
          <Logo className="h-12 w-auto" />
          <div className="max-w-[34ch] space-y-3">
            <InlineRichText field={settings.data.footer_text} />
          </div>
          <address className="grid gap-1 not-italic">
            <a href={site.mapsHref} {...external} className={link}>
              {site.street}, {site.city}
            </a>
            {site.contacts.map((c) => (
              <a key={c.name} href={telHref(c.phone)} className={`tabular whitespace-nowrap ${link}`}>
                {c.name}: {c.phone}
              </a>
            ))}
            {site.email && (
              <a href={`mailto:${site.email}`} className={`whitespace-nowrap ${link}`}>
                {site.email}
              </a>
            )}
          </address>
          {site.hoursNote && <p>{site.hoursNote}</p>}
        </div>

        {columns.map((col) => (
          <nav key={col.label} aria-label={col.label}>
            <h2 className="mb-4 font-semibold text-chalk">{col.label}</h2>
            <ul className="grid gap-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="bg-carbon">
        <div className="frame flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
            {site.vatNumber ? `, ${site.vatNumber}` : ""}. Website door Anthony Decap.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.rating && site.reviewsHref && (
              <li>
                <a href={site.reviewsHref} {...external} className={link}>
                  {site.rating}/5 op {site.ratingSource}
                </a>
              </li>
            )}
            {site.whatsapp && (
              <li>
                <a href={whatsappHref(site.whatsapp)} {...external} className={link}>
                  WhatsApp
                </a>
              </li>
            )}
            {site.instagram && (
              <li>
                <a href={site.instagram} {...external} className={link}>
                  Instagram
                </a>
              </li>
            )}
            {site.facebook && (
              <li>
                <a href={site.facebook} {...external} className={link}>
                  Facebook
                </a>
              </li>
            )}
            {extra.map((l) => (
              <li key={l.href}>
                <a href={l.href} {...(/^https?:/.test(l.href) ? external : {})} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
