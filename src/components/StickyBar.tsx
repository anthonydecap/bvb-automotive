"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The phone's contact bar on a car page. It appears once the price has scrolled away and leaves again
 * when the contact form comes into view, so it never sits over the price, the form or the footer.
 */
export function StickyBar({ after, until, children }: { after: string; until: string; children: ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const start = document.querySelector(after);
    const end = document.querySelector(until);
    if (!start || !end) return;
    let past = false;
    let near = false;
    const update = () => setShown(past && !near);
    const a = new IntersectionObserver(([e]) => {
      past = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    const b = new IntersectionObserver(([e]) => {
      near = e.isIntersecting || e.boundingClientRect.top < 0;
      update();
    });
    a.observe(start);
    b.observe(end);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, [after, until]);

  return (
    <div
      data-sticky-bar
      className={`fixed inset-x-0 bottom-0 z-40 bg-ink px-4 py-3 text-chalk transition-transform duration-300 lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!shown}
      inert={!shown}
    >
      {children}
    </div>
  );
}
