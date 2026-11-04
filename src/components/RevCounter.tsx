"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Review = { quote: string; name: string; date: string };

/** Tick marks of a 0–5 dial over 270 degrees. */
const ticks = Array.from({ length: 51 }, (_, k) => {
  const a = ((-135 + k * 5.4) * Math.PI) / 180;
  const big = k % 10 === 0;
  const r1 = big ? 172 : 178;
  return {
    k,
    big,
    x1: 200 + r1 * Math.sin(a),
    y1: 200 - r1 * Math.cos(a),
    x2: 200 + 186 * Math.sin(a),
    y2: 200 - 186 * Math.cos(a),
    tx: 200 + 150 * Math.sin(a),
    ty: 206 - 150 * Math.cos(a),
  };
});

/** The score as a rev counter whose needle sweeps up to it, beside the reviews, one at a time. */
export function RevCounter({ score, label, reviews }: { score: number; label: string; reviews: Review[] }) {
  const gauge = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [current, setCurrent] = useState(0);
  const [swap, setSwap] = useState(false);
  const fraction = Math.max(0, Math.min(1, score / 5));

  useEffect(() => {
    const el = gauge.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const show = (i: number) => {
    setSwap(true);
    window.setTimeout(() => {
      setCurrent(i);
      setSwap(false);
    }, 300);
  };

  useEffect(() => {
    if (reviews.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => show((current + 1) % reviews.length), 7000);
    return () => window.clearTimeout(t);
  }, [current, reviews.length]);

  const review = reviews[current];
  const scoreText = score.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rev-grid">
      <div
        ref={gauge}
        className="gauge"
        role="img"
        aria-label={`Gemiddelde score ${scoreText} op 5 ${label}`}
        style={{ "--a": shown ? `${-135 + 270 * fraction}deg` : "-135deg" } as CSSProperties}
      >
        <svg viewBox="0 0 400 400" aria-hidden="true">
          {ticks.map((t) => (
            <g key={t.k}>
              <line
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.k > 49 ? "#cfae57" : "#5d5f8f"}
                strokeWidth={t.big ? 3 : 1.5}
              />
              {t.big && (
                <text
                  x={t.tx}
                  y={t.ty}
                  fill="#b3b5cf"
                  fontSize="15"
                  fontWeight="700"
                  textAnchor="middle"
                  fontStyle="italic"
                >
                  {t.k / 10}
                </text>
              )}
            </g>
          ))}
          <path d="M 87 313 A 160 160 0 1 1 313 313" fill="none" stroke="#2b2d63" strokeWidth="10" />
          <path
            className="arc"
            d="M 87 313 A 160 160 0 1 1 313 313"
            fill="none"
            stroke="#cfae57"
            strokeWidth="10"
            strokeDasharray="754"
            strokeDashoffset={shown ? 754 * (1 - fraction) : 754}
          />
          <g className="needle">
            <path d="M200 200 L200 62" stroke="#f5f4ef" strokeWidth="4" strokeLinecap="round" />
            <circle cx="200" cy="200" r="12" fill="#cfae57" />
          </g>
        </svg>
        <div className="gauge-read">
          <b>{scoreText}</b>
          <span className="text-mist">van 5 {label}</span>
        </div>
      </div>

      <div>
        <h2 className="speed text-[clamp(2rem,1.2rem+2.6vw,3.75rem)]">Wat kopers zeggen</h2>
        {review && (
          <figure className={`quote mt-8 ${swap ? "swap" : ""}`} aria-live="polite">
            <blockquote>{review.quote}</blockquote>
            <figcaption className="mt-6 font-bold text-gold">
              {review.name}
              {review.date ? `, ${review.date}` : ""}
            </figcaption>
          </figure>
        )}
        {reviews.length > 1 && (
          <div
            className="rev-tabs"
            role="tablist"
            aria-label="Reviews"
            style={{ "--n": reviews.length } as CSSProperties}
          >
            {reviews.map((r, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                onClick={() => i !== current && show(i)}
              >
                <i key={i === current ? `on-${current}` : "off"} />
                {r.name.split(",")[0]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
