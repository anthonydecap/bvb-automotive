import { telHref, whatsappHref } from "@/lib/format";
import type { SiteInfo } from "@/lib/site";

import { Phone, WhatsApp } from "./Icons";

type ContactButtonsProps = {
  site: SiteInfo;
  message?: string;
  className?: string;
  phoneClassName?: string;
};

/** "Bel" and "WhatsApp" buttons with the numbers from Settings. */
export function ContactButtons({ site, message, className = "", phoneClassName = "btn-ghost" }: ContactButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {site.phone && (
        <a href={telHref(site.phone)} className={`btn ${phoneClassName}`}>
          <Phone size={18} />
          <span className="tabular">{site.phone}</span>
        </a>
      )}
      {site.whatsapp && (
        <a
          href={whatsappHref(site.whatsapp, message)}
          className="btn btn-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsApp size={18} />
          WhatsApp
        </a>
      )}
    </div>
  );
}
