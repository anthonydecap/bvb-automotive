"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { telHref, whatsappHref } from "@/lib/format";
import type { NavGroup, NavLink, SiteInfo } from "@/lib/site";

import { ArrowRight, ChevronDown, Close, Instagram, MapPin, Menu, Phone, WhatsApp } from "./Icons";
import { Logo } from "./Logo";

type HeaderProps = {
  nav: NavGroup[];
  cta?: NavLink;
  site: SiteInfo;
};

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function Header({ nav, cta, site }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus after navigation.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setDropdown(null);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openDropdown = (i: number) => {
    clearTimeout(closeTimer.current);
    setDropdown(i);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdown(null), 140);
  };

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      {/* Utility bar */}
      <div
        className={`hidden overflow-hidden border-b border-white/10 bg-ink transition-[max-height,opacity] duration-500 lg:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="container-x flex h-10 items-center justify-between text-[0.8125rem] text-mist">
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-gold" />
            {[site.street, site.city].filter(Boolean).join(", ")}
            <span className="text-steel">·</span>
            Bezoek op afspraak, ook &rsquo;s avonds
          </p>
          <div className="flex items-center gap-6">
            {site.phone && (
              <a href={telHref(site.phone)} className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone size={15} className="text-gold" />
                <span className="tabular">{site.phone}</span>
              </a>
            )}
            {site.whatsapp && (
              <a
                href={whatsappHref(site.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <WhatsApp size={15} className="text-gold" />
                WhatsApp
              </a>
            )}
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solid
            ? "bg-ink/92 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md"
            : "bg-gradient-to-b from-ink/70 to-transparent"
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="shrink-0" aria-label={`${site.name}, naar de homepagina`}>
            <Logo className="h-10 w-auto lg:h-12" priority />
          </Link>

          <nav aria-label="Hoofdmenu" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item, i) => {
                const active =
                  isActive(pathname, item.href) || item.children.some((c) => isActive(pathname, c.href));
                if (!item.children.length) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`block rounded px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:text-gold ${
                          active ? "text-gold" : "text-white/90"
                        }`}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => openDropdown(i)}
                    onMouseLeave={closeDropdown}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 rounded px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:text-gold ${
                        active ? "text-gold" : "text-white/90"
                      }`}
                      aria-expanded={dropdown === i}
                      aria-controls={`menu-${i}`}
                      onClick={() => setDropdown(dropdown === i ? null : i)}
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-300 ${dropdown === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      id={`menu-${i}`}
                      className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-300 ${
                        dropdown === i
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      <ul className="overflow-hidden rounded-md border border-white/10 bg-carbon/98 p-2 shadow-2xl shadow-black/50 backdrop-blur">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              className={`group flex items-center justify-between rounded px-3.5 py-2.5 text-[0.9375rem] transition-colors hover:bg-white/5 ${
                                pathname === child.href ? "text-gold" : "text-white/85 hover:text-white"
                              }`}
                              aria-current={pathname === child.href ? "page" : undefined}
                            >
                              {child.label}
                              <ArrowRight
                                size={15}
                                className="-translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {cta && (
              <Link href={cta.href} className="btn btn-gold hidden min-h-11 sm:inline-flex">
                {cta.label}
              </Link>
            )}
            {site.phone && (
              <a
                href={telHref(site.phone)}
                className="grid size-11 place-items-center rounded border border-white/15 xl:hidden"
                aria-label={`Bel ${site.phone}`}
              >
                <Phone size={19} />
              </a>
            )}
            <button
              type="button"
              className="grid size-11 place-items-center rounded border border-white/15 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menu sluiten" : "Menu openen"}
              onClick={() => setOpen(!open)}
            >
              {open ? <Close size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-ink transition-[opacity,visibility] duration-300 lg:top-20 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        inert={!open}
      >
        <nav aria-label="Mobiel menu" className="container-x flex min-h-full flex-col py-6">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {nav.map((item, i) => (
              <li key={item.label}>
                {item.children.length ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left text-xl font-semibold"
                      aria-expanded={expanded === i}
                      onClick={() => setExpanded(expanded === i ? null : i)}
                    >
                      {item.label}
                      <ChevronDown
                        size={20}
                        className={`text-gold transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        expanded === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul className="overflow-hidden">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              className={`block py-2.5 pl-4 text-[1.0625rem] ${
                                pathname === child.href ? "text-gold" : "text-white/75"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                        <li className="h-3" aria-hidden="true" />
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-4 text-xl font-semibold ${isActive(pathname, item.href) ? "text-gold" : ""}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-10">
            {cta && (
              <Link href={cta.href} className="btn btn-gold w-full">
                {cta.label}
              </Link>
            )}
            <div className="grid grid-cols-2 gap-3">
              {site.phone && (
                <a href={telHref(site.phone)} className="btn btn-ghost">
                  <Phone size={18} /> Bellen
                </a>
              )}
              {site.whatsapp && (
                <a href={whatsappHref(site.whatsapp)} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <WhatsApp size={18} /> WhatsApp
                </a>
              )}
            </div>
            <p className="pt-4 text-center text-sm text-mist">
              {[site.street, site.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
