/** Subjects of the contact form. Kept in sync with the "contact" slice model. */
export const subjects = [
  "Informatie over een wagen",
  "Import op aanvraag",
  "Inruil of verkoop van mijn wagen",
  "Detailing",
  "Service & herstelling",
  "Uitlaatsystemen",
  "Schroefsets & verlaging",
  "Financiering",
  "Autotransport",
  "Andere",
] as const;

export type Subject = (typeof subjects)[number];

/** Extra fields per subject, shown below the subject select. */
export const extraFields: Partial<Record<Subject, { name: string; label: string; type?: string }[]>> = {
  "Inruil of verkoop van mijn wagen": [
    { name: "wagen", label: "Merk en model" },
    { name: "bouwjaar", label: "Bouwjaar", type: "number" },
    { name: "kilometerstand", label: "Kilometerstand", type: "number" },
  ],
  Autotransport: [
    { name: "wagen", label: "Merk en model van de wagen" },
    { name: "ophaallocatie", label: "Ophaallocatie" },
    { name: "bestemming", label: "Bestemming" },
    { name: "datum", label: "Gewenste transportdatum", type: "date" },
  ],
  "Import op aanvraag": [{ name: "wagen", label: "Welke wagen zoekt u?" }],
  Detailing: [{ name: "wagen", label: "Merk en model van de wagen" }],
  "Service & herstelling": [{ name: "wagen", label: "Merk en model van de wagen" }],
  Uitlaatsystemen: [{ name: "wagen", label: "Merk en model van de wagen" }],
  "Schroefsets & verlaging": [{ name: "wagen", label: "Merk en model van de wagen" }],
};

export const fieldLabels: Record<string, string> = {
  naam: "Naam",
  email: "E-mail",
  telefoon: "Telefoon",
  onderwerp: "Onderwerp",
  wagen: "Wagen",
  bouwjaar: "Bouwjaar",
  kilometerstand: "Kilometerstand",
  ophaallocatie: "Ophaallocatie",
  bestemming: "Bestemming",
  datum: "Datum",
  bericht: "Bericht",
  pagina: "Verstuurd vanaf",
};
