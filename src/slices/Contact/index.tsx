import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ContactForm } from "@/components/ContactForm";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, WhatsApp } from "@/components/Icons";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { telHref, whatsappHref } from "@/lib/format";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type ContactProps = SliceComponentProps<Content.ContactSlice, SliceContext>;

const Contact = ({ slice, context }: ContactProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);

  if (slice.variation === "form") {
    return (
      <Section slice={slice} id="formulier">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
            <div className="mt-8 grid gap-3 text-[0.9375rem]">
              {site.phone && (
                <a href={telHref(site.phone)} className="flex items-center gap-3 font-semibold hover:text-gold-deep">
                  <Phone size={18} className="text-gold-deep" /> <span className="tabular">{site.phone}</span>
                </a>
              )}
              {site.whatsapp && (
                <a href={whatsappHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-semibold hover:text-gold-deep">
                  <WhatsApp size={18} className="text-gold-deep" /> WhatsApp
                </a>
              )}
              {site.email && (
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 font-semibold hover:text-gold-deep">
                  <Mail size={18} className="text-gold-deep" /> {site.email}
                </a>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-md border border-bone bg-white/70 p-6 sm:p-8">
              <ContactForm site={site} defaultSubject={p.default_subject} title={p.form_title} />
            </div>
          </div>
        </div>
      </Section>
    );
  }

  const card = "flex flex-col rounded-md border border-bone bg-white p-7";

  return (
    <Section slice={slice} id="formulier">
      <div className="container-x">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} align="split" />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <li className={card}>
            <Phone size={24} className="text-gold-deep" />
            <h3 className="mt-6 text-lg font-bold">Direct bellen</h3>
            <ul className="mt-3 space-y-1.5">
              {site.contacts.map((c) => (
                <li key={c.name}>
                  <a href={telHref(c.phone)} className="tabular font-semibold hover:text-gold-deep">
                    {c.name}: {c.phone}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-sm text-stone">U krijgt Ian of Lucas meteen aan de lijn.</p>
          </li>
          <li className={card}>
            <WhatsApp size={24} className="text-gold-deep" />
            <h3 className="mt-6 text-lg font-bold">WhatsApp</h3>
            <a href={whatsappHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-semibold hover:text-gold-deep">
              Stuur een bericht <ArrowUpRight size={16} />
            </a>
            <p className="mt-auto pt-4 text-sm text-stone">
              Handig voor foto&rsquo;s en korte vragen. Meestal antwoorden we binnen enkele uren.
            </p>
          </li>
          <li className={card}>
            <Mail size={24} className="text-gold-deep" />
            <h3 className="mt-6 text-lg font-bold">E-mail</h3>
            <a href={`mailto:${site.email}`} className="mt-3 font-semibold break-all hover:text-gold-deep">
              {site.email}
            </a>
            <p className="mt-auto pt-4 text-sm text-stone">Voor offertes, uitgebreide vragen of documenten.</p>
          </li>
          <li className={`${card} bg-ink text-white`}>
            <MapPin size={24} className="text-gold" />
            <h3 className="mt-6 text-lg font-bold">Showroom en werkplaats</h3>
            <a href={site.mapsHref} target="_blank" rel="noopener noreferrer" className="mt-3 font-semibold hover:text-gold">
              {site.street}
              <br />
              {site.city}
            </a>
            <dl className="mt-auto space-y-1 pt-5 text-sm">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-3">
                  <dt className="text-mist">{h.days}</dt>
                  <dd className="tabular text-right">{h.hours}</dd>
                </div>
              ))}
            </dl>
          </li>
        </ul>
        {site.hoursNote && (
          <p className="mt-5 flex items-center gap-2 text-sm text-stone">
            <Clock size={16} className="text-gold-deep" /> {site.hoursNote}
          </p>
        )}

        {p.show_form && (
          <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h3 className="display text-3xl sm:text-4xl">{p.form_title || "Stuur ons een bericht"}</h3>
              <p className="mt-4 text-lg text-stone">
                Kies het juiste onderwerp, dan komt uw bericht meteen bij de juiste persoon terecht.
              </p>
              <ul className="mt-8 space-y-4 border-t border-bone pt-8 text-[0.9375rem]">
                {[
                  ["Reactie binnen 24 uur", "Op werkdagen, meestal binnen enkele uren."],
                  ["Eén persoon voor uw vraag", "Geen doorverwijzing, geen 'iemand belt u terug'."],
                  ["Interesse in een wagen?", "We stellen meteen een moment voor de bezichtiging voor."],
                  ["Werkplaatsvraag?", "U krijgt een offerte of een voorstel voor de planning."],
                ].map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold">{t}</p>
                    <p className="text-stone">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-8">
              <div className="rounded-md border border-bone bg-white p-6 sm:p-10">
                <ContactForm site={site} defaultSubject={p.default_subject} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Contact;
