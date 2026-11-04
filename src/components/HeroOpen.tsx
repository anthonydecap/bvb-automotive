"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The home page's first screen. The photograph starts as a block beside the headline and opens to
 * the whole screen over the first stretch of scrolling. With reduced motion it is simply shown.
 */
export function HeroOpen({
  photo,
  children,
  caption,
}: {
  photo: ReactNode;
  children: ReactNode;
  caption?: ReactNode;
}) {
  const hero = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const el = hero.current;
      if (!el || !stage.current) return;
      // Measured against the stage (100svh), not innerHeight, which jumps as a phone's address bar hides.
      const run = el.offsetHeight - stage.current.offsetHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / run));
      const eased = 1 - Math.pow(1 - p, 3);
      stage.current.style.setProperty("--c", (1 - eased).toFixed(4));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={hero} className="hero bg-night text-chalk" data-slice-type="hero">
      <div ref={stage} className="hero-stage">
        <div className="hero-photo">{photo}</div>
        <div className="hero-copy frame">{children}</div>
        {caption && (
          <div className="hero-caption" aria-hidden="true">
            {caption}
          </div>
        )}
      </div>
    </section>
  );
}
