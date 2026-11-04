import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Icon className="arrow" {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Icon>
);
export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);
export const ChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
export const ChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);
export const ChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);
export const Plus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
export const Menu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Icon>
);
export const Phone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />
  </Icon>
);
export const Mail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </Icon>
);
export const MapPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);
export const Clock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);
export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);
export const Shield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 5 5.5v6c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5v-6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Icon>
);
export const Key = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 8-8M16 7l2.5 2.5M14 9l2 2" />
  </Icon>
);
export const Wrench = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 0-2-2Z" />
    <path d="M14.5 6.5 17 4l3 3-2.5 2.5" />
  </Icon>
);
export const Sparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z" />
    <path d="M19 16c.2 1.4.8 2 2 2.2-1.2.2-1.8.8-2 2.2-.2-1.4-.8-2-2-2.2 1.2-.2 1.8-.8 2-2.2Z" />
  </Icon>
);
export const User = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </Icon>
);
export const Car = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 15.5v-3l2-4.5A2 2 0 0 1 7.3 7h9.4a2 2 0 0 1 1.8 1l2 4.5v3a1 1 0 0 1-1 1h-1M6.5 16.5h-2a1 1 0 0 1-1-1M9.5 16.5h5M3.5 12.5h17" />
    <circle cx="8" cy="16.5" r="1.8" />
    <circle cx="16" cy="16.5" r="1.8" />
  </Icon>
);
export const Search = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Icon>
);
export const Calendar = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);
export const Euro = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17.5 6.5A6.5 6.5 0 1 0 17.5 17.5M4.5 10.5h9M4.5 13.5h8" />
  </Icon>
);
export const Truck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.5v2.5h-7" />
    <circle cx="6.5" cy="17" r="1.8" />
    <circle cx="17" cy="17" r="1.8" />
  </Icon>
);
export const Star = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5Z" />
  </Icon>
);
export const StarFilled = ({ size = 16, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z" />
  </svg>
);
export const Gauge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 17a8.5 8.5 0 1 1 15 0" />
    <path d="m12 14 4-5" />
    <circle cx="12" cy="14" r="1.3" />
  </Icon>
);
export const Document = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 3h8l4 4v14h-12z" />
    <path d="M14.5 3v4h4M9 12h6M9 16h6" />
  </Icon>
);
export const Fuel = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 20.5v-15A1.5 1.5 0 0 1 6 4h6a1.5 1.5 0 0 1 1.5 1.5v15M3.5 20.5h11M4.5 10h9" />
    <path d="M13.5 8.5h2a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 0 3 0V8l-2.5-2.5" />
  </Icon>
);
export const Gearbox = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="5.5" r="1.8" />
    <circle cx="12" cy="5.5" r="1.8" />
    <circle cx="18" cy="5.5" r="1.8" />
    <circle cx="6" cy="18.5" r="1.8" />
    <circle cx="12" cy="18.5" r="1.8" />
    <path d="M6 7.3v9.4M12 7.3v9.4M18 7.3V12H6" />
  </Icon>
);
export const Road = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 3 4 21M16 3l4 18M12 4v3M12 10.5v3M12 17v3" />
  </Icon>
);
export const Bolt = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />
  </Icon>
);
export const Expand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Icon>
);
export const Sliders = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Icon>
);
export const WhatsApp = ({ size = 20, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.4Z" />
  </svg>
);
export const Instagram = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </Icon>
);
export const Facebook = ({ size = 20, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
  </svg>
);

/** Icons editors can pick in Prismic, by their Dutch name. */
const byName = {
  Vinkje: Check,
  Schild: Shield,
  Sleutel: Key,
  Werktuig: Wrench,
  Glans: Sparkle,
  Persoon: User,
  Wagen: Car,
  Zoeken: Search,
  Kalender: Calendar,
  Telefoon: Phone,
  Euro: Euro,
  Transport: Truck,
  Klok: Clock,
  Ster: Star,
  Meter: Gauge,
  Document: Document,
  Locatie: MapPin,
  Kruis: Close,
} as const;

export function NamedIcon({ name, ...props }: IconProps & { name: string | null | undefined }) {
  const Component = name ? byName[name as keyof typeof byName] : undefined;
  return Component ? <Component {...props} /> : null;
}
