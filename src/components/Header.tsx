"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { telHref, whatsappHref } from "@/lib/format";
import type { NavGroup, NavLink, SiteInfo } from "@/lib/site";

import { ChevronDown, Close, Menu, Phone } from "./Icons";
import { Logo } from "./Logo";

type HeaderProps = {
  nav: NavGroup[];
  cta?: NavLink;
  site: SiteInfo;
};

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** A plain ink bar: monogram, the menu, the phone number and one action. */
export function Header({ nav, cta, site }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  const navLink = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-2 font-medium transition-colors hover:text-gold ${active ? "text-gold" : "text-chalk"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink text-chalk">
      <div className="frame flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <Link href="/" className="shrink-0" aria-label={`${site.name}, naar de homepagina`}>
          <Logo className="h-10 w-auto lg:h-12" priority />
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden xl:block">
          <ul className="flex items-center">
            {nav.map((item, i) => {
              const active =
                isActive(pathname, item.href) || item.children.some((c) => isActive(pathname, c.href));
              if (!item.children.length) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={navLink(active)}
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
                    className={navLink(active)}
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
                    className={`menu-drop absolute top-full left-0 w-72 pt-3 ${dropdown === i ? "block" : "hidden"}`}
                  >
                    {/* A menu floats, so it may carry a shadow. */}
                    <ul
                      className="bg-carbon p-2 shadow-2xl shadow-black/40" /* taste-skill-ignore: a floating menu */
                    >
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            className={`block px-4 py-3 transition-colors hover:bg-graphite ${
                              pathname === child.href ? "text-gold" : "text-chalk"
                            }`}
                            aria-current={pathname === child.href ? "page" : undefined}
                          >
                            {child.label}
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
          {site.phone && (
            <a
              href={telHref(site.phone)}
              className="tabular hidden px-3 py-2 font-medium transition-colors hover:text-gold 2xl:block"
            >
              {site.phone}
            </a>
          )}
          {cta && (
            <Link href={cta.href} className="btn btn-gold hidden sm:inline-flex">
              {cta.label}
            </Link>
          )}
          {site.phone && (
            <a
              href={telHref(site.phone)}
              className="grid size-12 place-items-center bg-graphite xl:hidden"
              aria-label={`Bel ${site.phone}`}
            >
              <Phone size={19} />
            </a>
          )}
          <button
            type="button"
            className="grid size-12 place-items-center bg-graphite xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            onClick={() => setOpen(!open)}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-ink transition-[opacity,visibility] duration-300 lg:top-20 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        inert={!open}
      >
        <nav aria-label="Mobiel menu" className="frame flex min-h-full flex-col py-6">
          <ul className="grid gap-1">
            {nav.map((item, i) => (
              <li key={item.label}>
                {item.children.length ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-3 text-left text-lead font-semibold"
                      aria-expanded={expanded === i}
                      onClick={() => setExpanded(expanded === i ? null : i)}
                    >
                      {item.label}
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`}
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
                              className={`block py-2.5 pl-4 ${pathname === child.href ? "text-gold" : "text-fog"}`}
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
                    className={`block py-3 text-lead font-semibold ${isActive(pathname, item.href) ? "text-gold" : ""}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-2 pt-10">
            {cta && (
              <Link href={cta.href} className="btn btn-gold w-full">
                {cta.label}
              </Link>
            )}
            <div className="grid grid-cols-2 gap-2">
              {site.phone && (
                <a href={telHref(site.phone)} className="btn btn-ghost">
                  Bellen
                </a>
              )}
              {site.whatsapp && (
                <a
                  href={whatsappHref(site.whatsapp)}
                  className="btn btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <p className="pt-4 text-center text-small text-fog">
              {[site.street, site.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
