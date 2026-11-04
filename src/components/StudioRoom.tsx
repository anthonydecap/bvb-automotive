"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The detailing studio. The visitor scrolls into a dark room; the light tubes switch on one by one
 * and the room turns studio white, then the work it does follows underneath.
 */
export function StudioRoom({
  title,
  intro,
  children,
}: {
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const run = useRef<HTMLDivElement>(null);
  const tubes = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sec = section.current;
    const r = run.current;
    if (!sec || !r) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tubes.current?.querySelectorAll(".tube").forEach((t) => t.classList.add("on"));
      sec.classList.add("lit");
      return;
    }
    let frame = 0;
    const update = () => {
      const rect = r.getBoundingClientRect();
      const lp = Math.max(
        0,
        Math.min(1, (-rect.top + innerHeight * 0.35) / (r.offsetHeight - innerHeight * 0.4)),
      );
      const list = [...(tubes.current?.querySelectorAll<HTMLElement>(".tube") ?? [])].filter(
        (t) => t.offsetParent,
      );
      list.forEach((t, k) => t.classList.toggle("on", lp > (k + 1) / (list.length + 2)));
      const on = Math.max(0, Math.min(1, (lp - 0.55) / 0.35));
      sec.style.setProperty("--on", on.toFixed(3));
      sec.classList.toggle("lit", on > 0.5);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={section} className="studio" data-slice-type="studio" id="studio">
      <div ref={run} className="studio-run">
        <div className="studio-room">
          <div ref={tubes} className="tubes" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} className="tube" />
            ))}
          </div>
          <div className="studio-title">
            {title}
            <div className="lead max-w-[34rem]">{intro}</div>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
