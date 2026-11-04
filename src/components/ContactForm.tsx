"use client";

import { useState, type FormEvent } from "react";

import { extraFields, subjects, type Subject } from "@/lib/contact";
import { telHref, whatsappHref } from "@/lib/format";
import type { SiteInfo } from "@/lib/site";

import { ArrowRight, Check, Mail, Phone, WhatsApp } from "./Icons";

type ContactFormProps = {
  site: SiteInfo;
  defaultSubject?: string | null;
  /** The car the visitor asks about, e.g. on a car page. */
  car?: string;
  dark?: boolean;
  title?: string | null;
};

type State = "idle" | "sending" | "sent" | "unavailable" | "error";

export function ContactForm({ site, defaultSubject, car, dark, title }: ContactFormProps) {
  const [subject, setSubject] = useState<Subject>(
    (subjects as readonly string[]).includes(defaultSubject ?? "") ? (defaultSubject as Subject) : subjects[0],
  );
  const [state, setState] = useState<State>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, pagina: window.location.href }),
      });
      if (res.ok) {
        setState("sent");
        form.reset();
      } else setState(res.status === 503 ? "unavailable" : "error");
    } catch {
      setState("error");
    }
  };

  const field = `peer w-full rounded border px-4 pt-6 pb-2 text-base transition-colors focus:border-gold focus:outline-none ${
    dark ? "border-white/15 bg-carbon text-white" : "border-bone bg-white text-ink"
  }`;
  const label = `pointer-events-none absolute top-2 left-4 text-xs font-medium ${dark ? "text-mist" : "text-stone"}`;
  const extras = extraFields[subject] ?? [];

  if (state === "sent") {
    return (
      <div className={`rounded-md border p-8 sm:p-10 ${dark ? "border-white/10 bg-carbon" : "border-bone bg-white"}`} role="status">
        <span className="grid size-14 place-items-center rounded-full bg-gold text-ink">
          <Check size={26} />
        </span>
        <h3 className="display mt-6 text-3xl">Bedankt, uw bericht is verstuurd</h3>
        <p className={`mt-3 text-lg ${dark ? "text-fog" : "text-stone"}`}>
          We reageren binnen 24 uur op werkdagen, meestal veel sneller. Dringend? Bel ons gerust.
        </p>
        <button type="button" className="btn btn-ghost mt-8" onClick={() => setState("idle")}>
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate={false}>
      {title && <h3 className="display mb-2 text-3xl">{title}</h3>}
      {car && <input type="hidden" name="wagen" value={car} />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input id="cf-naam" name="naam" required autoComplete="name" className={field} placeholder=" " />
          <label htmlFor="cf-naam" className={label}>
            Naam *
          </label>
        </div>
        <div className="relative">
          <input id="cf-telefoon" name="telefoon" type="tel" autoComplete="tel" className={field} placeholder=" " />
          <label htmlFor="cf-telefoon" className={label}>
            Telefoon of WhatsApp
          </label>
        </div>
      </div>
      <div className="relative">
        <input id="cf-email" name="email" type="email" required autoComplete="email" className={field} placeholder=" " />
        <label htmlFor="cf-email" className={label}>
          E-mailadres *
        </label>
      </div>

      {!car && (
        <div className="relative">
          <select
            id="cf-onderwerp"
            name="onderwerp"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className={`${field} appearance-none`}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label htmlFor="cf-onderwerp" className={label}>
            Onderwerp
          </label>
        </div>
      )}
      {car && <input type="hidden" name="onderwerp" value="Informatie over een wagen" />}

      {!car && extras.length > 0 && (
        <div className={`grid gap-4 ${extras.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {extras.map((f) => (
            <div key={f.name} className="relative">
              <input id={`cf-${f.name}`} name={f.name} type={f.type ?? "text"} className={field} placeholder=" " />
              <label htmlFor={`cf-${f.name}`} className={label}>
                {f.label}
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <textarea
          id="cf-bericht"
          name="bericht"
          required
          rows={5}
          className={`${field} resize-y`}
          placeholder=" "
          defaultValue={car ? `Ik heb interesse in de ${car}. Graag plan ik een bezichtiging of proefrit.` : undefined}
        />
        <label htmlFor="cf-bericht" className={label}>
          Bericht *
        </label>
      </div>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className={`max-w-md text-sm ${dark ? "text-mist" : "text-stone"}`}>
          We gebruiken uw gegevens alleen om uw vraag te beantwoorden. Foto&rsquo;s stuurt u het makkelijkst via
          WhatsApp.
        </p>
        <button type="submit" className="btn btn-gold shrink-0" disabled={state === "sending"}>
          {state === "sending" ? "Bezig met versturen…" : "Bericht versturen"}
          <ArrowRight size={18} />
        </button>
      </div>

      {(state === "unavailable" || state === "error") && (
        <div
          role="alert"
          className={`rounded-md border p-5 text-[0.9375rem] ${dark ? "border-reserved/40 bg-reserved/10" : "border-reserved/50 bg-reserved/10"}`}
        >
          <p className="font-semibold">Uw bericht kon niet verstuurd worden.</p>
          <p className="mt-1 opacity-80">Neem gerust rechtstreeks contact op, we helpen u graag verder:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.phone && (
              <a href={telHref(site.phone)} className="btn btn-ghost min-h-10 py-2">
                <Phone size={16} /> {site.phone}
              </a>
            )}
            {site.whatsapp && (
              <a href={whatsappHref(site.whatsapp, car ? `Hallo, ik heb interesse in de ${car}.` : undefined)} className="btn btn-whatsapp min-h-10 py-2" target="_blank" rel="noopener noreferrer">
                <WhatsApp size={16} /> WhatsApp
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}${car ? `?subject=${encodeURIComponent(car)}` : ""}`} className="btn btn-ghost min-h-10 py-2">
                <Mail size={16} /> {site.email}
              </a>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
