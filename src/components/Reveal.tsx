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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}
