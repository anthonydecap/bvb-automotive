"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A pinned stage whose content runs sideways while the page scrolls down. The pinned stretch is as
 * long as the track is wide. On narrow screens and with reduced motion the steps simply stack.
 */
export function ProcessTrack({ children, label }: { children: ReactNode; label: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const size = () => {
      const pinned = window.innerWidth > 900 && !reduce;
      el.style.height = pinned
        ? `${window.innerHeight + Math.max(0, tr.scrollWidth - el.clientWidth + 40)}px`
        : "";
    };
    const update = () => {
      if (window.innerWidth <= 900 || reduce) {
        tr.style.transform = "";
        return;
      }
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (el.offsetHeight - window.innerHeight)));
      tr.style.transform = `translateX(${-p * (tr.scrollWidth - el.clientWidth + 40)}px)`;
      bar.current?.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      size();
      onScroll();
    };
    size();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={section} className="process bg-night text-chalk" aria-label={label} data-slice-type="steps">
      <div className="process-stage">
        <div ref={track} className="process-track">
          {children}
        </div>
        <div className="progress" aria-hidden="true">
          <i ref={bar} />
        </div>
      </div>
    </section>
  );
}
