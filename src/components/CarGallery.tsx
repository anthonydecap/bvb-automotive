"use client";

import type { ImageField } from "@prismicio/client";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Close, Expand } from "./Icons";
import { Img } from "./Img";

type CarGalleryProps = {
  images: ImageField[];
  title: string;
};

/** Swipeable photo carousel with thumbnails and a full-screen viewer. */
export function CarGallery({ images, title }: CarGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const lightTrack = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const count = images.length;

  const scrollTo = useCallback((el: HTMLDivElement | null, i: number, smooth = true) => {
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "instant" });
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = (i + count) % count;
      setIndex(next);
      scrollTo(lightbox ? lightTrack.current : track.current, next);
    },
    [count, lightbox, scrollTo],
  );

  // Keep the index in sync with swipes.
  const onScroll = (el: HTMLDivElement | null) => {
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  // Keep the active thumbnail in view.
  useEffect(() => {
    const thumb = thumbs.current?.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, index, go]);

  const open = () => {
    dialog.current?.showModal();
    setLightbox(true);
    requestAnimationFrame(() => scrollTo(lightTrack.current, index, false));
  };
  const close = () => {
    dialog.current?.close();
  };
  const onClose = () => {
    setLightbox(false);
    scrollTo(track.current, index, false);
  };

  if (!count) return <div className="aspect-[3/2] rounded-md bg-graphite" />;

  const arrow =
    "grid size-11 place-items-center rounded-full bg-ink/70 text-white backdrop-blur transition-colors hover:bg-gold hover:text-ink";

  return (
    <div>
      <div className="group relative overflow-hidden rounded-md bg-graphite">
        <div
          ref={track}
          onScroll={() => onScroll(track.current)}
          className="no-scrollbar flex aspect-[3/2] snap-x snap-mandatory overflow-x-auto"
          aria-roledescription="carrousel"
          aria-label={`Foto's van de ${title}`}
        >
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={open}
              className="relative w-full shrink-0 snap-center cursor-zoom-in"
              aria-label={`Foto ${i + 1} van ${count} vergroten`}
            >
              <Img
                field={image}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                alt={image.alt || `${title}, foto ${i + 1}`}
              />
            </button>
          ))}
        </div>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} className={`${arrow} absolute top-1/2 left-3 -translate-y-1/2`} aria-label="Vorige foto">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => go(index + 1)} className={`${arrow} absolute top-1/2 right-3 -translate-y-1/2`} aria-label="Volgende foto">
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between">
          <span className="spec-label tabular rounded-sm bg-ink/75 px-2.5 py-1.5 text-white backdrop-blur">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={open}
            className="spec-label pointer-events-auto flex items-center gap-2 rounded-sm bg-ink/75 px-2.5 py-1.5 text-white backdrop-blur transition-colors hover:bg-gold hover:text-ink"
          >
            <Expand size={14} /> Alle foto&rsquo;s
          </button>
        </div>
      </div>

      {count > 1 && (
        <div ref={thumbs} className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={`relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-sm transition-opacity sm:w-28 ${
                i === index ? "opacity-100 ring-2 ring-gold ring-offset-2 ring-offset-ink" : "opacity-50 hover:opacity-90"
              }`}
              aria-label={`Toon foto ${i + 1}`}
              aria-current={i === index}
            >
              <Img field={image} fill sizes="112px" className="object-cover" alt="" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        onClose={onClose}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/97 p-0 text-white backdrop:bg-ink/90"
        aria-label={`Foto's van de ${title}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="spec-label tabular text-mist">
              {index + 1} / {count}
            </p>
            <p className="hidden truncate px-6 font-semibold sm:block">{title}</p>
            <button type="button" onClick={close} className={arrow} aria-label="Sluiten">
              <Close size={20} />
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <div
              ref={lightTrack}
              onScroll={() => onScroll(lightTrack.current)}
              className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
            >
              {images.map((image, i) => (
                <div key={i} className="relative h-full w-full shrink-0 snap-center">
                  {lightbox && Math.abs(i - index) <= 2 && (
                    <Img field={image} fill sizes="100vw" className="object-contain" alt={image.alt || `${title}, foto ${i + 1}`} />
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => go(index - 1)} className={`${arrow} absolute top-1/2 left-4 -translate-y-1/2`} aria-label="Vorige foto">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => go(index + 1)} className={`${arrow} absolute top-1/2 right-4 -translate-y-1/2`} aria-label="Volgende foto">
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="h-6" />
        </div>
      </dialog>
    </div>
  );
}
