const number = new Intl.NumberFormat("nl-BE");

export const formatNumber = (n: number) => number.format(n);

/** € 33.950 */
export const formatPrice = (n: number) => `€ ${number.format(Math.round(n))}`;

/** 42.000 km */
export const formatKm = (n: number) => `${number.format(n)} km`;

/** 12 mei 2025 */
export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value),
  );
}

/** Digits only, with a leading country code, for tel: and wa.me links. */
export function phoneDigits(phone: string | null | undefined) {
  const digits = (phone ?? "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("0")) return `32${digits.slice(1)}`;
  return digits;
}

export const telHref = (phone: string | null | undefined) => `tel:+${phoneDigits(phone)}`;

export function whatsappHref(phone: string | null | undefined, text?: string) {
  const base = `https://wa.me/${phoneDigits(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
