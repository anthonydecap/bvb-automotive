"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
};

/**
 * Its children rise into place one after another, once, when the block scrolls into view.
 * The hidden state lives in CSS behind `html[data-js]` and `prefers-reduced-motion: no-preference`,
 * so without script or with reduced motion everything is simply there.
 */
export function Reveal({ as: Tag = "div", className, style, id, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reveal = () => {
      node.dataset.reveal = "visible";
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
    // A jump from below a block to above it never intersects, so scrolling checks the position too.
    const check = () => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.9) reveal();
    };
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && reveal(), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(node);
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <Tag ref={ref} id={id} data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}
