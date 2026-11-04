import Link from "next/link";

import { telHref, whatsappHref } from "@/lib/format";
import { href, navigation, type Settings, siteInfo } from "@/lib/site";

import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone, StarFilled, WhatsApp } from "./Icons";
import { Logo } from "./Logo";
import { InlineRichText } from "./RichText";

export function Footer({ settings }: { settings: Settings }) {
  const site = siteInfo(settings);
  const nav = navigation(settings);
  const groups = nav.filter((g) => g.children.length);
  const singles = nav.filter((g) => !g.children.length);
  const extra = settings.data.footer_links
    .map((l) => ({ label: l.label, href: href(l.link) }))
    .filter((l): l is { label: string; href: string } => !!l.label && !!l.href);

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="h-16 w-auto" />
            <div className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-mist">
              <InlineRichText field={settings.data.footer_text} />
            </div>
            {site.rating && (
              <a
                href={site.reviewsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded border border-white/10 px-4 py-3 transition-colors hover:border-gold/60"
              >
                <span className="flex text-gold">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarFilled key={i} size={15} />
                  ))}
                </span>
                <span className="text-sm">
                  <strong className="font-semibold">{site.rating}/5</strong>
                  <span className="text-mist"> op {site.ratingSource}</span>
                </span>
              </a>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="spec-label text-gold">{group.label}</p>
                <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
                  {group.children.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="link-line text-white/75 hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {singles.length > 0 && (
              <div>
                <p className="spec-label text-gold">BVB</p>
                <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
                  {singles.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="link-line text-white/75 hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <p className="spec-label text-gold">Contact</p>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li>
                <a
                  href={site.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 text-white/75 hover:text-white"
                >
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    {site.street}
                    <br />
                    {site.city}
                  </span>
                </a>
              </li>
              {site.phone && (
                <li>
                  <a href={telHref(site.phone)} className="flex gap-3 text-white/75 hover:text-white">
                    <Phone size={18} className="shrink-0 text-gold" />
                    <span className="tabular">{site.phone}</span>
                  </a>
                </li>
              )}
              {site.whatsapp && (
                <li>
                  <a
                    href={whatsappHref(site.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 text-white/75 hover:text-white"
                  >
                    <WhatsApp size={18} className="shrink-0 text-gold" />
                    WhatsApp
                  </a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="flex gap-3 text-white/75 hover:text-white">
                    <Mail size={18} className="shrink-0 text-gold" />
                    {site.email}
                  </a>
                </li>
              )}
            </ul>
            {site.hours.length > 0 && (
              <dl className="mt-8 space-y-1.5 border-t border-white/10 pt-6 text-sm">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt className="text-mist">{h.days}</dt>
                    <dd className="tabular text-right">{h.hours}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-8 flex gap-2">
              {site.instagram && (
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid size-11 place-items-center rounded border border-white/15 transition-colors hover:border-gold hover:text-gold"
                >
                  <Instagram size={19} />
                </a>
              )}
              {site.facebook && (
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid size-11 place-items-center rounded border border-white/15 transition-colors hover:border-gold hover:text-gold"
                >
                  <Facebook size={19} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
            {site.vatNumber ? ` · ${site.vatNumber}` : ""}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {extra.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  {...(/^https?:/.test(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  {l.label}
                  {/^https?:/.test(l.href) && <ArrowUpRight size={14} />}
                </a>
              </li>
            ))}
            <li>
              Website door <span className="text-white/80">Anthony Decap</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
