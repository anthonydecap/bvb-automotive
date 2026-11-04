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

/** Transparent over the first screen, solid night once the page moves. */
export function Header({ nav, cta, site }: HeaderProps) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setDropdown(null);
  }

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header className={`site-header text-chalk ${solid || open ? "solid" : ""}`}>
      <div className="frame flex h-20 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label={`${site.name}, naar de homepagina`}>
          <Logo className="h-11 w-auto lg:h-12" priority />
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {nav.map((item, i) => {
              const active =
                isActive(pathname, item.href) || item.children.some((c) => isActive(pathname, c.href));
              if (!item.children.length) {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
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
                    className="nav-link flex items-center gap-1.5"
                    aria-expanded={dropdown === i}
                    aria-controls={`menu-${i}`}
                    aria-current={active ? "page" : undefined}
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
                    className={`menu-drop absolute top-full -left-4 w-72 pt-4 ${dropdown === i ? "block" : "hidden"}`}
                  >
                    <ul
                      className="bg-carbon p-2 shadow-2xl shadow-black/50" /* taste-skill-ignore: a floating menu */
                    >
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            className={`block px-4 py-3 font-medium transition-colors hover:bg-navy-2 ${
                              pathname === child.href ? "text-gold" : ""
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
          {cta && (
            <Link href={cta.href} className="btn btn-gold hidden sm:inline-flex">
              {cta.label}
            </Link>
          )}
          {site.phone && (
            <a
              href={telHref(site.phone)}
              className="grid size-12 place-items-center bg-navy xl:hidden"
              aria-label={`Bel ${site.phone}`}
            >
              <Phone size={19} />
            </a>
          )}
          <button
            type="button"
            className="grid size-12 place-items-center bg-navy xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            onClick={() => setOpen(!open)}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-20 bottom-0 overflow-y-auto bg-night transition-[opacity,visibility] duration-300 xl:hidden ${
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
                      className="speed flex w-full items-center justify-between py-3 text-left text-[1.6rem]"
                      aria-expanded={expanded === i}
                      onClick={() => setExpanded(expanded === i ? null : i)}
                    >
                      {item.label}
                      <ChevronDown
                        size={22}
                        className={`transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${expanded === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <ul className="overflow-hidden">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              className={`block py-2.5 pl-4 ${pathname === child.href ? "text-gold" : "text-mist"}`}
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
                    className={`speed block py-3 text-[1.6rem] ${isActive(pathname, item.href) ? "text-gold" : ""}`}
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
            <p className="pt-4 text-center text-small text-mist">
              {[site.street, site.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
