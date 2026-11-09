import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { ContactForm } from "@/components/ContactForm";
import { PhotoStrip } from "@/components/PhotoStrip";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { mainImage } from "@/lib/cars";
import { getCars } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import type { SliceContext } from "@/lib/slice-context";
import { siteInfo } from "@/lib/site";

export type ContactProps = SliceComponentProps<Content.ContactSlice, SliceContext>;

const Contact = async ({ slice, context }: ContactProps) => {
  const p = slice.primary;
  const site = siteInfo(context.settings);
  const stock = (await getCars())
    .map(mainImage)
    .filter((i) => i?.url)
    .slice(0, 24);

  const direct = (
    <ul className="grid gap-1 text-lead font-medium">
      {site.phone && (
        <li>
          <a href={telHref(site.phone)} className="link tabular">
            {site.phone}
          </a>
        </li>
      )}
      {site.whatsapp && (
        <li>
          <a href={whatsappHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="link">
            WhatsApp
          </a>
        </li>
      )}
      {site.email && (
        <li>
          <a href={`mailto:${site.email}`} className="link break-all">
            {site.email}
          </a>
        </li>
      )}
    </ul>
  );

  if (slice.variation === "form") {
    return (
      <Section slice={slice} id="formulier">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="space-y-8 lg:col-span-5">
            <SectionHeading title={p.title} intro={p.intro} align="left" />
            {direct}
          </Reveal>
          <div className="bg-navy p-6 sm:p-10 lg:col-span-7">
            <ContactForm site={site} defaultSubject={p.default_subject} title={p.form_title} />
          </div>
        </div>
        <PhotoStrip images={stock} className="mt-[var(--section)]" />
      </Section>
    );
  }

  return (
    <Section slice={slice} id="formulier">
      <div className="frame">
        <SectionHeading title={p.title} intro={p.intro} align="split" />

        {/* The people, then the place. Numbers in large type: this page exists to be dialled. */}
        <div className="mt-14 grid gap-[var(--gap)] lg:mt-20 lg:grid-cols-12">
          <Reveal as="ul" className="grid content-start gap-10 bg-navy p-6 sm:p-10 lg:col-span-7">
            {site.contacts.map((c) => (
              <li key={c.name}>
                <a
                  href={telHref(c.phone)}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 transition-colors hover:text-gold"
                >
                  <span className="speed head">{c.name}</span>
                  <span className="tabular text-lead font-semibold">{c.phone}</span>
                </a>
              </li>
            ))}
            <li className="grid gap-1 text-lead font-medium">
              {site.whatsapp && (
                <a
                  href={whatsappHref(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link w-fit"
                >
                  Stuur een WhatsApp
                </a>
              )}
              {site.email && (
                <a href={`mailto:${site.email}`} className="link w-fit break-all">
                  {site.email}
                </a>
              )}
            </li>
          </Reveal>
          <Reveal className="flex flex-col bg-gold p-6 text-night sm:p-10 lg:col-span-5">
            <h3 className="text-lead font-semibold">Showroom en werkplaats</h3>
            <a
              href={site.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-3 w-fit text-body"
            >
              {site.street}, {site.city}
            </a>
            <dl className="mt-auto grid gap-2 pt-10 text-body">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="tabular text-right">{h.hours}</dd>
                </div>
              ))}
            </dl>
            {site.hoursNote && <p className="mt-4 text-small">{site.hoursNote}</p>}
          </Reveal>
        </div>

        {p.show_form && (
          <div className="mt-[var(--section)] grid gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <h3 className="speed text-[clamp(1.5rem,1rem+1.6cqw,2.6rem)]">
                {p.form_title || "Stuur ons een bericht"}
              </h3>
              <p className="mt-6 text-body">
                Kies het juiste onderwerp, dan komt uw bericht meteen bij de juiste persoon terecht. Op
                werkdagen antwoorden we binnen 24 uur, meestal binnen enkele uren.
              </p>
            </Reveal>
            <div className="bg-navy p-6 sm:p-10 lg:col-span-8">
              <ContactForm site={site} defaultSubject={p.default_subject} />
            </div>
          </div>
        )}
      </div>
      <PhotoStrip images={stock} className="mt-[var(--section)]" />
    </Section>
  );
};

export default Contact;
