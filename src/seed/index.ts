import { carDocuments } from "./cars";
import { buttons, doc, document, h, img, noImage, noLink, pageParents, rt, slice, web } from "./helpers";

/**
 * Seed content for the BVB Automotive website, rewritten from the old
 * WordPress site. Served while the Prismic repository is still empty and
 * pushed to Prismic with `npm run seed:prismic`. After the first publish,
 * Prismic is the only source of truth.
 */

const links = {
  autoscout: "https://www.autoscout24.be/nl/verkopers/bvb-automotive-geel/reviews",
  instagram: "https://www.instagram.com/bvb_automotive/",
  facebook: "https://www.facebook.com/BVBAutomotiveDetailing/",
  maps: "https://www.google.com/maps/search/?api=1&query=BVB+Automotive+Winkelom+83+2440+Geel",
};

const images = {
  golfR: img("2026/08/DSC06881.jpg", "Blauwe Volkswagen Golf R op de parking van BVB Automotive"),
  golfBlack: img("2026/10/DSC07451.jpg", "Zwarte Volkswagen Golf GTI Clubsport voor de showroom"),
  firstGolf: img(
    "2026/06/DSC00608-scaled-1.jpg",
    "Blauwe Volkswagen Golf 7 GTI in de garage waar BVB Automotive begon",
  ),
  golfGti: img("2026/07/BVB_Volkswagen_Golf_GTI_1.jpg", "Volkswagen Golf GTI van BVB Automotive"),
  x3mBlack: img("2026/06/DSC05043.jpg", "Zwarte BMW X3 M Competition"),
  x3mGrey: img("2026/06/DSC05745.jpg", "Grijze BMW X3 M Competition"),
  bmw1: img("2026/06/DSC03395-e1758883962551.jpg", "Grijze BMW M140i voor een bedrijfsgebouw"),
  bmwFront: img("2026/06/DSC03399.jpg", "Koplamp en nieren van een grijze BMW 1-reeks"),
  bmwWheel: img("2026/06/DSC03413.jpg", "Lichtmetalen velg van een BMW"),
  bmwBlue: img("2026/07/IMG_3787-2.jpg", "Blauwe BMW 1-reeks aan de haven"),
  interior: img("2026/10/DSC02773.jpg", "Interieur van een BMW met sportstuur"),
  m2Exhaust: img("2026/06/BMW_M2_3.jpg", "Uitlaatsierstukken van een BMW M2"),
  akraTip: img("2026/06/IMG_1489-scaled-1.jpg", "Titanium Akrapovič-uitlaatsierstuk"),
  lowered: img("2026/06/DSC03651.jpg", "Verlaagde Volkswagen Golf met rode remklauwen"),
  alignment: img("2026/06/uitlijning_autoband.jpg", "Wiel met meetplaat tijdens een vierwieluitlijning"),
  transport: img("2026/10/autotransport_belgie_4.jpg", "Iveco Daily-autotransporter van BVB Automotive"),
  gt3: img("2026/06/Porsche_GT3_RS_Red_68.jpg", "Rode Porsche 911 GT3 RS in de detailingstudio"),
  gtiWheel: img("2026/06/DSC03651.jpg", "Grijze Volkswagen Golf GTI Clubsport met rode remklauwen"),
  wheelCare: img("2026/06/BVB_detailing_20.jpeg", "Velg wordt gereinigd in de studio"),
  detailer: img("2026/06/BVB_detailing_4.jpeg", "Detailer van BVB Automotive met Gyeon-producten"),
  studio: img(
    "2026/06/BVB_detailing_15.jpeg",
    "Twee detailers werken aan een Porsche 911 in de studio van BVB Automotive",
  ),
  studioPorsche: img("2026/06/detailing_porsche.jpeg", "Porsche 911 GT3 tijdens een detailingbehandeling"),
  polishing: img("2026/06/BVB_detailing_26.jpeg", "Lakcorrectie met een polijstmachine"),
  coatingProduct: img("2026/06/BVB_detailing_33.jpeg", "Detailer van BVB Automotive met Gyeon-producten"),
  engineBay: img("2026/06/BVB_detailing_31.jpeg", "Reiniging van een motorcompartiment"),
  map: img("2026/05/bvb-map.png", "Kaart van de omgeving van Winkelom in Geel, vlak bij de E313"),
};

const detailingGallery = [1, 2, 3, 4, 5, 8, 12, 16, 19, 20, 28, 32].map((n) =>
  img(`2026/06/BVB_detailing_${n}.jpeg`, `Detailingwerk in de studio van BVB Automotive, foto ${n}`),
);

const logos = {
  gyeon: img("2026/05/certified-studio-white.png", "Gyeon Certified Studio"),
  carpass: img("2026/06/carpass-logo-white.png", "Car-Pass"),
  rowe: img("2026/06/rowe_motoroil_logo.png", "ROWE motorolie"),
  akrapovic: img("2026/06/Akrapovic-logo-scaled.png", "Akrapovič"),
  remus: img("2026/06/Remus-logo.png", "Remus"),
  milltek: img("2026/06/milltek-sport-logo.png", "Milltek Sport"),
};

const logo = (image: typeof logos.gyeon, name: string) => ({ logo: image, name, link: noLink });

// ---------------------------------------------------------------- shared blocks

function hero(
  eyebrow: string,
  title: string,
  intro: string[],
  image: typeof images.golfR | typeof noImage,
  btns: ReturnType<typeof buttons> = [],
  stats: { value: string; label: string }[] = [],
  variation = "page",
) {
  return slice(
    "hero",
    { eyebrow, title: h(title), intro: rt(...intro), image, buttons: btns, stats },
    variation,
  );
}

type Item = { icon?: string; title: string; text: string | string[]; link?: string; linkLabel?: string };

function features(
  head: { eyebrow?: string; title: string; intro?: string[] },
  items: Item[],
  opts: {
    layout?: "Kaarten" | "Lijst" | "Genummerd";
    columns?: "2" | "3" | "4";
    tone?: "Licht" | "Donker";
  } = {},
) {
  return slice("features", {
    eyebrow: head.eyebrow ?? null,
    title: h(head.title),
    intro: rt(...(head.intro ?? [])),
    layout: opts.layout ?? "Kaarten",
    columns: opts.columns ?? (items.length % 3 === 0 ? "3" : items.length === 2 ? "2" : "4"),
    tone: opts.tone ?? "Licht",
    items: items.map((item) => ({
      icon: item.icon ?? "Geen",
      title: item.title,
      text: rt(...(Array.isArray(item.text) ? item.text : [item.text])),
      link_label: item.linkLabel ?? null,
      link: item.link ? doc("page", item.link) : noLink,
    })),
  });
}

function steps(
  head: { eyebrow?: string; title: string; intro?: string[] },
  items: [string, string, typeof images.golfR?][],
  tone = "Licht",
) {
  return slice("steps", {
    eyebrow: head.eyebrow ?? null,
    title: h(head.title),
    intro: rt(...(head.intro ?? [])),
    tone,
    items: items.map(([title, text, image]) => ({ title, text: rt(text), image: image ?? noImage })),
  });
}

function studio(
  head: { title: string; intro: string },
  image: typeof images.golfR,
  caption: string,
  items: [string, string, typeof images.golfR][],
  badge: { image: typeof images.golfR; text: string; button: [string, string] },
) {
  return slice("studio", {
    title: h(head.title),
    intro: rt(head.intro),
    image,
    caption,
    items: items.map(([title, text, img]) => ({ image: img, title, text: rt(text) })),
    badge: badge.image,
    badge_text: badge.text,
    button_label: badge.button[0],
    button_link: doc("page", badge.button[1]),
  });
}

function textMedia(
  head: { eyebrow?: string; title: string },
  text: string[],
  image: typeof images.golfR | typeof noImage = noImage,
  opts: { position?: "Rechts" | "Links"; tone?: "Licht" | "Donker"; btns?: ReturnType<typeof buttons> } = {},
) {
  return slice("text_media", {
    eyebrow: head.eyebrow ?? null,
    title: h(head.title),
    intro: [],
    text: rt(...text),
    image,
    image_position: opts.position ?? "Rechts",
    tone: opts.tone ?? "Licht",
    buttons: opts.btns ?? [],
  });
}

function cta(
  title: string,
  intro: string,
  opts: {
    eyebrow?: string;
    btns?: ReturnType<typeof buttons>;
    image?: typeof images.golfR;
    contact?: boolean;
  } = {},
) {
  return slice("cta_banner", {
    eyebrow: opts.eyebrow ?? null,
    title: h(title),
    intro: rt(intro),
    image: opts.image ?? noImage,
    buttons: opts.btns ?? [],
    show_contact: opts.contact ?? true,
  });
}

function faq(eyebrow: string | null, title: string, items: [string, string[]][], intro: string[] = []) {
  return slice("faq", {
    eyebrow,
    title: h(title),
    intro: rt(...intro),
    items: items.map(([question, answer]) => ({ question, answer: rt(...answer) })),
  });
}

function carGrid(
  selection: string,
  head: { eyebrow?: string; title: string; intro?: string[] },
  opts: { filters?: boolean; sold?: boolean; limit?: number; button?: [string, string] } = {},
) {
  return slice("car_grid", {
    eyebrow: head.eyebrow ?? null,
    title: h(head.title),
    intro: rt(...(head.intro ?? [])),
    selection,
    show_filters: opts.filters ?? false,
    show_sold: opts.sold ?? false,
    limit: opts.limit ?? null,
    button_label: opts.button?.[0] ?? null,
    button_link: opts.button ? doc("page", opts.button[1]) : noLink,
  });
}

const reviews = (
  title = "*4,94/5* op AutoScout24",
  intro = "Wat klanten na hun aankoop over ons schrijven.",
  items: { quote: string; name: string; date: string | null }[] = [],
) =>
  slice("reviews", {
    eyebrow: "Reviews",
    title: h(title),
    intro: rt(intro),
    button_label: "Lees alle reviews op AutoScout24",
    button_link: web(links.autoscout),
    items: items.map((r) => ({ quote: rt(r.quote), name: r.name, date: r.date })),
  });

const quote = (text: string, author: string | null = null, tone = "Donker") =>
  slice("quote", { quote: rt(text), author, tone });

const stats = (items: [string, string][], tone = "Donker") =>
  slice("stats", { tone, items: items.map(([value, label]) => ({ value, label })) });

const logoStrip = (
  title: string | null,
  items: ReturnType<typeof logo>[],
  intro: string[] = [],
  tone = "Donker",
) => slice("logo_strip", { eyebrow: null, title: title ? h(title) : [], intro: rt(...intro), tone, items });

const location = slice("location", {
  eyebrow: "Ligging",
  title: h("Vijf minuten van de E313"),
  intro: rt(
    "Onze showroom ligt op vijf minuten van de E313, afrit Geel-West. Ook vanuit Herentals, Mol, Westerlo, Turnhout, Olen en Kasterlee bent u snel bij ons.",
    "Bezichtigingen gebeuren op afspraak, ook 's avonds voor wie pas na het werk kan langskomen.",
  ),
  image: images.map,
  travel: [
    { from: "Antwerpen", time: "35 min", route: "E313, afrit Geel-West" },
    { from: "Hasselt", time: "40 min", route: "E313, afrit Geel-West" },
    { from: "Leuven", time: "45 min", route: "E314 en N19" },
    { from: "Brussel", time: "55 min", route: "E19 en E313" },
  ],
  button_label: "Plan uw route",
  button_link: web(links.maps),
});

const contactForm = (title: string, intro: string, subject: string, eyebrow = "Contact") =>
  slice(
    "contact",
    {
      eyebrow,
      title: h(title),
      intro: rt(intro),
      show_form: true,
      form_title: null,
      default_subject: subject,
    },
    "form",
  );

const quoteCta = (subject: string) =>
  cta(
    "Vraag een *offerte op maat* aan",
    `Elke ${subject} begint met een gesprek. Stuur ons enkele foto's van uw wagen en vertel wat u zoekt: binnen 24 uur hebt u een offerte, zonder verplichting.`,
    { btns: buttons(["Offerte aanvragen", "contact"]) },
  );

// ---------------------------------------------------------------- settings

const settings = document("settings", null, {
  site_name: "BVB Automotive",
  tagline: "Sportieve occasies uit de Kempen",
  navigation: [
    { label: "Aanbod", link: doc("page", "aanbod"), level: "Hoofdmenu" },
    { label: "Volledig aanbod", link: doc("page", "aanbod"), level: "Submenu" },
    { label: "VAG Specialist Selectie", link: doc("page", "vag-specialist"), level: "Submenu" },
    { label: "BMW & Mini", link: doc("page", "bmw"), level: "Submenu" },
    { label: "Premium & Performance", link: doc("page", "premium-performance"), level: "Submenu" },
    { label: "Werkplaats", link: doc("page", "werkplaats"), level: "Hoofdmenu" },
    { label: "Onze werkplaats", link: doc("page", "werkplaats"), level: "Submenu" },
    { label: "Keramische coating", link: doc("page", "keramische-coating"), level: "Submenu" },
    { label: "Service & herstelling", link: doc("page", "service-herstelling"), level: "Submenu" },
    { label: "Uitlaatsystemen", link: doc("page", "uitlaatsystemen"), level: "Submenu" },
    { label: "Schroefsets & verlaging", link: doc("page", "schroefsets"), level: "Submenu" },
    { label: "Verkoop uw wagen", link: doc("page", "verkoop-uw-wagen"), level: "Hoofdmenu" },
    { label: "Financiering", link: doc("page", "financiering"), level: "Hoofdmenu" },
    { label: "Over ons", link: doc("page", "over-ons"), level: "Hoofdmenu" },
    { label: "Over BVB Automotive", link: doc("page", "over-ons"), level: "Submenu" },
    { label: "Autotransport", link: doc("page", "autotransport"), level: "Submenu" },
    { label: "Veelgestelde vragen", link: doc("page", "veelgestelde-vragen"), level: "Submenu" },
    { label: "Contact", link: doc("page", "contact"), level: "Hoofdmenu" },
  ],
  header_cta: doc("page", "contact", "Plan een bezichtiging"),

  phone: "+32 468 18 93 83",
  whatsapp: "+32 468 18 93 83",
  email: "info@bvbautomotive.be",
  contacts: [
    { name: "Ian", phone: "+32 468 18 93 83" },
    { name: "Lucas", phone: "+32 499 29 70 54" },
  ],
  street: "Winkelom 83, unit C1",
  city: "2440 Geel",
  maps_link: web(links.maps),
  opening_hours: [
    { days: "Maandag tot vrijdag", hours: "9.00 tot 18.00" },
    { days: "Zaterdag en zondag", hours: "Op afspraak" },
  ],
  hours_note: "Bezoek altijd op afspraak, ook 's avonds na 18.00.",
  instagram: web(links.instagram),
  facebook: web(links.facebook),
  vat_number: null,

  rating: "4,94",
  rating_source: "AutoScout24",
  reviews_link: web(links.autoscout),
  reviews: [
    {
      quote: rt(
        "Eerlijke verkoper. Alles verliep heel vlot. Ook de service na aankoop van het voertuig is top.",
      ),
      name: "Laurens",
      date: "2025-05-12",
    },
    {
      quote: rt(
        "Begin december heb ik mijn wagen aangekocht bij BVB Automotive en ik kan enkel maar zeggen: wow, wat een topservice van begin tot einde!",
      ),
      name: "M. Martens",
      date: "2025-12-26",
    },
    {
      quote: rt("Zeer aangename verkoop. Steeds bereikbaar en alles is snel afgehandeld."),
      name: "Robin",
      date: "2025-03-29",
    },
    {
      quote: rt("Alles ging perfect, een zeer betrouwbare persoon."),
      name: "Kristof B.",
      date: "2025-05-07",
    },
  ],

  car_promise: [
    {
      icon: "Werktuig",
      title: "Technisch nagekeken",
      text: "Door onze eigen monteurs, in onze werkplaats in Geel.",
    },
    { icon: "Document", title: "Car-Pass", text: "Officieel attest met de volledige kilometerhistoriek." },
    {
      icon: "Glans",
      title: "Volledige detailing",
      text: "Exterieur en interieur, in showroomstaat afgeleverd.",
    },
    {
      icon: "Schild",
      title: "Garantie op papier",
      text: "Duidelijk uitgeschreven, met onze werkplaats achter de hand.",
    },
  ],
  car_cta_title: "Interesse in deze wagen?",
  car_cta_text: rt(
    "Plan een bezichtiging of proefrit. De wagen staat klaar als u aankomt, ook 's avonds op afspraak. Een mondelinge reservatie houden we 48 uur voor u vast.",
  ),
  finance_rate: 6.5,
  finance_months: 60,
  finance_down: 20,
  finance_link: doc("page", "financiering"),

  footer_text: rt(
    "Sportieve VAG- en BMW-occasies, een eigen werkplaats en een Gyeon Certified Studio onder één dak in Geel.",
  ),
  footer_links: [
    { label: "Reviews op AutoScout24", link: web(links.autoscout) },
    { label: "Veelgestelde vragen", link: doc("page", "veelgestelde-vragen") },
  ],
  meta_description:
    "BVB Automotive in Geel: geselecteerde sportieve VAG- en BMW-occasies, technisch nagekeken, met Car-Pass en volledige detailing. Eigen werkplaats en Gyeon Certified Studio.",
  meta_image: images.golfR,
});

// ---------------------------------------------------------------- pages

const page = (
  uid: string,
  title: string,
  slices: ReturnType<typeof slice>[],
  meta: { title?: string; description: string },
) =>
  document("page", uid, {
    title,
    parent: pageParents[uid] ? doc("page", pageParents[uid]) : noLink,
    slices,
    meta_title: meta.title ?? null,
    meta_description: meta.description,
    meta_image: {},
  });

const home = page(
  "home",
  "Home",
  [
    hero(
      "Golf 8 GTI Clubsport",
      "Sportieve occasies",
      [
        "Golf GTI's, R's, RS3's en BMW M's, uitgekozen in Geel. Elke wagen nagekeken in onze werkplaats, met Car-Pass en Gyeon-detailing.",
      ],
      images.gtiWheel,
      buttons(["Bekijk het aanbod", "aanbod"], ["Plan een bezichtiging", "contact"]),
      [],
      "default",
    ),
    carGrid(
      "Uitgelicht",
      {
        title: "Nu in de showroom",
        intro: [
          "Een greep uit wat er vandaag klaarstaat. Elke week vertrekken er twee à drie wagens, dus wacht niet te lang.",
        ],
      },
      { limit: 6, button: ["Volledig aanbod", "aanbod"] },
    ),
    stats([
      ["4,94", "gemiddelde score op AutoScout24"],
      ["100+", "wagens afgeleverd uit Geel"],
      ["20", "minuten proefrit, ook op de autostrade"],
      ["48", "uur houden we een wagen voor u vast"],
    ]),
    steps(
      {
        title: "Van selectie tot sleutel",
        intro: ["Wat bij ons in de showroom staat, heeft vier stappen doorlopen. Geen enkele slaan we over."],
      },
      [
        [
          "Selectie",
          "We kopen alleen wagens die we zelf zouden rijden. Onderhoudshistoriek, schadeverleden, kilometerstand en marktprijs moeten kloppen. Twijfelen we, dan kopen we niet.",
          images.bmwFront,
        ],
        [
          "Werkplaats",
          "Onze eigen monteurs lezen de wagen uit met merkspecifieke software, vervangen wat nodig is en lijnen uit. Daarna volgt de Car-Pass.",
          images.alignment,
        ],
        [
          "Detailing",
          "Geen snelle wasbeurt: lakcorrectie, interieur en motorruimte door onze Gyeon-gecertificeerde detailers.",
          images.polishing,
        ],
        [
          "Sleutels",
          "Een proefrit van minstens twintig minuten, garantie op papier en de inschrijving geregeld. Een week later bellen we om te horen of alles naar wens is.",
          images.interior,
        ],
      ],
    ),
    studio(
      {
        title: "Gyeon Certified Studio",
        intro:
          "Onze eigen detailingstudio in Geel, één van de weinige gecertificeerde in België. Elke wagen die we verkopen komt hier eerst onder de lampen.",
      },
      images.studio,
      "Porsche 911 GT3 onder de lampen",
      [
        [
          "Lakcorrectie",
          "Swirls en krasjes polijsten we weg in meerdere stappen, tot de lak weer spiegelt.",
          images.polishing,
        ],
        [
          "Keramische coating",
          "Gyeon-coatings die buiten het netwerk niet te koop zijn, met garantie op papier.",
          images.detailer,
        ],
        [
          "Velgen en remmen",
          "Ontijzeren, reinigen en coaten, zodat remstof er niet meer in bijt.",
          images.wheelCare,
        ],
        ["Motorruimte", "Grondig en veilig gereinigd, en daarna beschermd.", images.engineBay],
        ["Afwerking", "Ruiten, rubbers en kunststoffen: alles wat de wagen showroomklaar maakt.", images.gt3],
      ],
      {
        image: logos.gyeon,
        text: "Elke twee jaar opnieuw gekeurd door Gyeon.",
        button: ["Vraag een offerte", "keramische-coating"],
      },
    ),
    carGrid(
      "Recent verkocht",
      {
        title: "Sleutels overhandigd",
        intro: [
          "Al deze wagens stonden ooit op onze parking in Geel. Vandaag rijden ze bij een nieuwe eigenaar.",
        ],
      },
      { button: ["Zoekt u er zo één?", "contact"] },
    ),
    reviews(),
    textMedia(
      { eyebrow: "Verkoop uw wagen", title: "Wij kopen uw wagen" },
      [
        "We kopen regelmatig sportieve VAG- en BMW-modellen in voor ons aanbod. Stuur ons enkele foto's, de kilometerstand en wat onderhoudsinfo.",
        "Binnen 48 uur krijgt u een concreet bod: één bedrag, geen vork. Koopt u tegelijk een wagen bij ons, dan zetten we de inruilwaarde meteen in mindering.",
      ],
      images.x3mGrey,
      { tone: "Donker", btns: buttons(["Vraag een waardebepaling", "verkoop-uw-wagen"]) },
    ),
    location,
    cta(
      "Bel even voor u komt",
      "Bijna elke week verdwijnen er twee à drie wagens uit het aanbod. Bel of stuur een WhatsApp om zeker te zijn dat uw wagen nog beschikbaar is.",
      { image: images.golfBlack, btns: buttons(["Plan een bezichtiging", "contact"]) },
    ),
  ],
  {
    title: "BVB Automotive · Sportieve VAG- en BMW-occasies in Geel",
    description:
      "Geselecteerde sportieve VAG- en BMW-occasies in Geel. Technisch nagekeken, met Car-Pass en volledige detailing. 4,94/5 op AutoScout24.",
  },
);

const included = (title = "Bij elke wagen inbegrepen", tone: "Licht" | "Donker" = "Donker") =>
  features(
    { eyebrow: "Altijd inbegrepen", title },
    [
      {
        icon: "Werktuig",
        title: "Nagekeken in eigen werkplaats",
        text: "Geen externe keuring die we op haar woord geloven: onze monteurs controleren de wagen zelf, in Geel, met eigen apparatuur.",
      },
      {
        icon: "Document",
        title: "Car-Pass bij aankoop",
        text: "Het officiële attest met de volledige kilometerhistoriek. Geen onaangename verrassingen achteraf.",
      },
      {
        icon: "Glans",
        title: "Gyeon-detailing",
        text: "Exterieur en interieur grondig gereinigd en verzorgd. U krijgt de wagen in showroomstaat.",
      },
      {
        icon: "Schild",
        title: "Garantie op papier",
        text: "Duidelijk uitgeschreven, niet verstopt in de kleine lettertjes. Is er in de eerste maanden iets, dan lossen we het in eigen huis op.",
      },
    ],
    { tone },
  );

const aanbod = page(
  "aanbod",
  "Aanbod",
  [
    hero(
      "Aanbod",
      "Ons volledige aanbod",
      [
        "Alle wagens uit onze showroom op één plek: VAG-modellen, BMW's en een selecte groep premium- en performancewagens. Elke wagen is technisch nagekeken en heeft een Car-Pass.",
      ],
      noImage,
    ),
    carGrid("Volledig aanbod", { title: "" }, { filters: true, sold: true }),
    included(),
    cta(
      "Niet gevonden *wat u zoekt*?",
      "We importeren ook op aanvraag uit Duitsland en Nederland. Car-Pass, btw-situatie en eventuele kosten leggen we vooraf helder uit.",
      { btns: buttons(["Vraag een import aan", "contact"]) },
    ),
  ],
  {
    title: "Aanbod tweedehandswagens",
    description:
      "Bekijk ons volledige aanbod sportieve tweedehandswagens: VAG, BMW en premium. Technisch nagekeken, met Car-Pass en volledige detailing.",
  },
);

const vag = page(
  "vag-specialist",
  "VAG Specialist Selectie",
  [
    hero(
      "VAG Specialist Selectie",
      "VAG Specialist Selectie",
      [
        "VAG is onze specialiteit. Niet omdat het in de mode is, maar omdat we deze wagens van binnen en van buiten kennen. Van de MQB-platformen tot de eigenaardigheden per modeljaar: we weten precies waar ze slijten en waar ze sterk in zijn.",
      ],
      images.golfBlack,
      buttons(["Plan een proefrit", "contact"]),
    ),
    carGrid("VAG", { eyebrow: "Voorraad", title: "VAG-wagens *in de showroom*" }, { sold: true }),
    textMedia(
      { title: "Elk model, zijn zwakke plek" },
      [
        "Een DSG-bak in een Golf 7 GTI vraagt ander onderhoud dan die in een Audi RS3. Een 2.0 TFSI uit 2014 heeft andere aandachtspunten dan dezelfde motor uit 2019. Een verkoper die 'alles' verkoopt, controleert die details niet. Een specialist wel.",
        "Onze monteurs kennen de eigenaardigheden van elk VAG-modeljaar. We lezen uit met VAG-specifieke software die veel verder gaat dan een generieke scan. En omdat we de reële marktprijs per model kennen, kopen we alleen aan wanneer de prijs past bij de staat.",
        "**Een generalist verkoopt u een VAG. Een specialist verkoopt u een VAG waarvan hij weet dat u er de komende jaren geen zorgen over hebt.**",
      ],
      images.golfGti,
    ),
    features(
      { eyebrow: "Onze merken", title: "Vijf merken, *één specialisatie*" },
      [
        {
          title: "Audi",
          text: "Van A3 tot RS6. Onze sterkste kennis zit in de sportieve S- en RS-modellen en de instap-premium met A3 en A4.",
        },
        { title: "Volkswagen", text: "De Golf GTI en Golf R vormen zowat de kern van wat we doen." },
        {
          title: "Cupra",
          text: "Het meest ondergewaardeerde VAG-merk op de tweedehandsmarkt. Leon en Formentor kopen we graag aan, mits een volledig onderhoudsboekje.",
        },
        {
          title: "Seat",
          text: "Het Cupra-gevoel voor een zachtere prijs, met de Leon FR en de Ateca in de hoofdrol.",
        },
        {
          title: "Škoda",
          text: "Octavia RS en Superb Sportline: een degelijke keuze voor wie liever onder de radar rijdt.",
        },
      ],
      { layout: "Lijst", columns: "3" },
    ),
    textMedia(
      { eyebrow: "Ons verhaal", title: "Het begon met *één Golf GTI*" },
      [
        "Een Golf GTI uit 2019, gekocht voor privégebruik. Maandenlang werkten we alle kleine dingen bij die de vorige eigenaar niet had gezien. Bij de doorverkoop bleek hoeveel verschil die aandacht maakte, en daar is een manier van werken uit gegroeid.",
        "Vandaag volgt elke VAG die we binnenhalen hetzelfde pad: aankopen wat we zelf zouden rijden, klaarmaken tot op het niveau van die eerste Golf, en afleveren aan iemand die dat verschil herkent.",
      ],
      images.firstGolf,
      { position: "Links", tone: "Donker", btns: buttons(["Meer over ons", "over-ons"]) },
    ),
    reviews("*4,94/5* op AutoScout24", "Meestal geschreven door kopers van een VAG."),
    cta(
      "Een VAG gezien die u *wil rijden*?",
      "Bel of stuur een WhatsApp voor een bezichtiging of proefrit. We reserveren de wagen tot 48 uur voor u.",
    ),
  ],
  {
    title: "VAG-occasies: Audi, Volkswagen, Cupra, Seat en Škoda",
    description:
      "Sportieve tweedehands Audi, Volkswagen, Cupra, Seat en Škoda, geselecteerd en nagekeken door VAG-specialisten in Geel.",
  },
);

const bmw = page(
  "bmw",
  "BMW & Mini",
  [
    hero(
      "BMW & Mini",
      "Tweedehands BMW en Mini",
      [
        "BMW is ons tweede grote merkenhuis. Van 1-reeks tot M-modellen, van 3 Touring tot X-SUV. We kopen BMW's aan met dezelfde criteria als onze VAG-voorraad: onderhoudshistoriek, schadeverleden, kilometerstand en marktprijs moeten kloppen.",
      ],
      images.bmw1,
      buttons(["Plan een bezichtiging", "contact"]),
    ),
    carGrid("BMW & Mini", { eyebrow: "Voorraad", title: "BMW's en Mini's *in de showroom*" }, { sold: true }),
    textMedia(
      { title: "Wat na de aankoop komt" },
      [
        "Of een BMW een goede koop was, merkt u pas na de eerste maanden. Oudere BMW's hebben hun eigen aandachtspunten, zoals de distributieketting bij bepaalde motoren of de koppeling bij handgeschakelde sportmodellen. Wie dat niet weet, ontdekt het bij de eerste werkplaatsbeurt.",
        "Onze monteurs kennen die eigenaardigheden. Voor elke BMW in ons aanbod gaat de controle verder dan een standaard tweedehandskeuring: we lezen de motorhistoriek uit tot op servicepoortniveau en coderen waar nodig.",
      ],
      images.bmwBlue,
    ),
    quote(
      "Een BMW kopen zonder BMW-kennis is als een wijn kopen op basis van het etiket. Wat erin zit, bepaalt wat u echt hebt.",
    ),
    features(
      { eyebrow: "Onze BMW-kennis", title: "Van 1-reeks *tot M*" },
      [
        {
          title: "1-reeks",
          text: "Een BMW aan een toegankelijke prijs. De M135i en M140i kopen we graag aan, met de juiste historiek en opties.",
        },
        {
          title: "3-reeks",
          text: "Sedan en Touring, de meest verkochte BMW's. De Touring is populair bij gezinnen die niet aan rijplezier willen inboeten.",
        },
        {
          title: "M-modellen",
          text: "M2, M3, M4 en af en toe een M5. Die krijgen een extra controle op circuitgebruik en de staat van de koppeling. Een M die verdacht onder de marktprijs zit, verkopen we niet.",
        },
        {
          title: "X-reeks",
          text: "X3 en X5, zolang ze in onze niche passen: met sport- of M-pakket. Pure gezins-SUV's zijn niet ons terrein.",
        },
      ],
      { layout: "Lijst" },
    ),
    features(
      { eyebrow: "BMW bij BVB", title: "Een BMW vraagt voorzorg" },
      [
        {
          icon: "Werktuig",
          title: "Eigen werkplaats",
          text: "Onderhoud en herstellingen in huis: sneller en betrouwbaarder.",
        },
        {
          icon: "Meter",
          title: "BMW-specifieke uitlezing",
          text: "Voor aankoop en voor aflevering lezen we de wagen uit met BMW-software.",
        },
        {
          icon: "Schild",
          title: "Garantie op papier",
          text: "We staan achter wat we verkopen. Geen verrassingen.",
        },
        {
          icon: "Glans",
          title: "Detailing inbegrepen",
          text: "Uw BMW vertrekt in showroomstaat: schoon, glanzend en klaar.",
        },
      ],
      { tone: "Donker" },
    ),
    reviews(),
    quote(
      "Topkerels! Toen ik binnenkwam, werd ik meteen heel vriendelijk ontvangen en kreeg ik over alles een uitgebreide uitleg. Toen ik had beslist welke auto ik wou, ging alles supersnel.",
      "Klant op AutoScout24",
      "Licht",
    ),
    cta(
      "Binnen drie weken verkocht",
      "Staat er iets tussen dat u bevalt? Bel of stuur een WhatsApp, zodat uw favoriete wagen volgende week niet bij iemand anders op de oprit staat.",
      { image: images.x3mBlack },
    ),
  ],
  {
    title: "Tweedehands BMW en Mini",
    description:
      "Sportieve tweedehands BMW's en Mini's in Geel: van 1-reeks tot M-modellen, met BMW-specifieke controle, Car-Pass en detailing.",
  },
);

const premium = page(
  "premium-performance",
  "Premium & Performance",
  [
    hero(
      "Premium & Performance",
      "Premium & Performance",
      [
        "Wagens die boven de gewone tweedehandsmarkt uitsteken: sterke motoren, rijke uitrusting en opties die nieuw flink wat kostten. Elke wagen in deze selectie is persoonlijk door ons aangekocht, door onze monteurs nagekeken en door onze detailers showroomklaar gemaakt.",
      ],
      images.x3mBlack,
      buttons(["Plan een privébezichtiging", "contact"]),
    ),
    textMedia({ eyebrow: "Wat u hier vindt", title: "Afgeschreven, niet uitgereden" }, [
      "In deze selectie staan wagens met een nieuwprijs van gemiddeld meer dan € 60.000. Meestal meer dan 250 pk, een uitgebreide uitrusting en optiepakketten die nieuw allesbehalve goedkoop waren.",
      "Wat u hier niet vindt: instapmodellen, kilometervreters of wagens over wier staat we twijfelen. De lat ligt hier bewust hoger dan in de rest van onze voorraad. Alleen wagens die ook onze eigen eerste keuze zouden zijn, komen erin.",
    ]),
    carGrid(
      "Premium & Performance",
      { eyebrow: "Voorraad", title: "Premiumwagens *in de showroom*" },
      { sold: true },
    ),
    features(
      { eyebrow: "Waarom bij ons", title: "Een premium aflevering" },
      [
        {
          icon: "Glans",
          title: "Gyeon Certified Studio",
          text: "Onze detailers maken elke wagen klaar tot op het niveau dat u van een wagen in deze klasse verwacht.",
        },
        {
          icon: "Werktuig",
          title: "Eigen werkplaats in Geel",
          text: "Geen doorverwijzing als er iets moet gebeuren. Eén aanspreekpunt voor aankoop, onderhoud en herstelling.",
        },
        {
          icon: "Ster",
          title: "4,94/5 op AutoScout24",
          text: "Geschreven door klanten die bij ons kochten, ook in deze prijsklasse.",
        },
        {
          icon: "Sleutel",
          title: "Discrete aflevering",
          text: "Liever buiten de kantooruren, of op locatie? Op afspraak regelen we het allebei.",
        },
      ],
      { tone: "Donker" },
    ),
    textMedia(
      { title: "Niet op prijs alleen" },
      [
        "Grote dealers in Brussel of Antwerpen verkopen ook zulke modellen, maar vaak in een proces dat onpersoonlijk aanvoelt. De wagen staat er, u komt, u vertrekt. Wat ertussen zit, is administratie.",
        "Bij ons werkt het andersom. We bespreken eerst wat u zoekt, nog voor u naar Geel rijdt. We reserveren genoeg tijd voor een echte proefrit van minstens twintig minuten. En we bekijken in hetzelfde gesprek uw toekomstige onderhoud, zodat u na de aankoop geen nieuw aanspreekpunt hoeft te zoeken.",
      ],
      images.interior,
      { position: "Links" },
    ),
    quote("Een luxewagen kopen zonder luxe koopervaring is als een maatpak kopen in de solden."),
    cta(
      "Uw premiumwagen verkopen?",
      "We kopen regelmatig performance- en premiummodellen in. Stuur foto's, de kilometerstand en onderhoudsinfo, en binnen 48 uur weet u wat we bieden.",
      { btns: buttons(["Vraag een waardebepaling", "verkoop-uw-wagen"]), contact: false },
    ),
    cta(
      "Binnen vier weken verkocht",
      "Voor dit segment raden we een privébezichtiging aan. Bel of stuur een WhatsApp en we plannen een moment dat u past.",
    ),
  ],
  {
    title: "Premium & Performance occasies",
    description:
      "Premium- en performance-occasies met een nieuwprijs boven € 60.000, nagekeken en showroomklaar gemaakt door BVB Automotive in Geel.",
  },
);

const werkplaats = page(
  "werkplaats",
  "Werkplaats",
  [
    hero(
      "Werkplaats",
      "Onze werkplaats",
      [
        "De werkplaats naast onze showroom doet meer dan ons eigen aanbod voorbereiden. Of u nu bij ons kocht of op zoek bent naar een Gyeon-detailing, een onderhoudsbeurt, een uitlaatsysteem of een schroefset: dezelfde mensen staan klaar, met hetzelfde kwaliteitsniveau.",
      ],
      images.studio,
      buttons(["Vraag een offerte", "contact"]),
    ),
    features({ eyebrow: "Onze diensten", title: "Wat we doen *in de werkplaats*" }, [
      {
        icon: "Glans",
        title: "Detailing en keramische coating",
        text: "Gyeon Certified Studio, één van de weinige in België. Van polijsten in één stap tot een keramische coating: exterieur, interieur, lakcorrectie en bescherming.",
        link: "keramische-coating",
        linkLabel: "Meer over detailing",
      },
      {
        icon: "Werktuig",
        title: "Service en herstelling",
        text: "Onderhoudsbeurten, technische controles en herstellingen voor VAG- en BMW-modellen.",
        link: "service-herstelling",
        linkLabel: "Meer over service",
      },
      {
        icon: "Meter",
        title: "Uitlaatsystemen",
        text: "Advies en montage van performance-uitlaatsystemen, met focus op VAG-sport en BMW M.",
        link: "uitlaatsystemen",
        linkLabel: "Meer over uitlaatsystemen",
      },
      {
        icon: "Wagen",
        title: "Schroefsets en verlaging",
        text: "Verlaging en onderstelafstelling voor sportieve wagens, vakkundig gemonteerd en correct uitgelijnd.",
        link: "schroefsets",
        linkLabel: "Meer over schroefsets",
      },
    ]),
    features(
      { eyebrow: "Waarom bij ons", title: "Waarom u uw wagen *bij ons laat*" },
      [
        {
          title: "Gespecialiseerd in VAG en BMW",
          text: "Geen garage die 'alle merken' doet. We kennen VAG- en BMW-modellen door en door. Dat betekent een snellere diagnose, de juiste onderdelen en geen uren zoekwerk.",
        },
        {
          title: "Eerlijke prijzen",
          text: "We bekijken uw wagen voor we een offerte maken. Werkt een onderdeel niet meer zoals het hoort, dan hoort u vooraf wat de echte kosten zijn. Geen onaangename extra's achteraf.",
        },
        {
          title: "Eén aanspreekpunt",
          text: "U belt ons en u krijgt ons. Geen doorverwijzing, geen wachtlijst. Meestal kunt u binnen de week terecht.",
        },
      ],
      { layout: "Genummerd", tone: "Donker" },
    ),
    textMedia(
      { eyebrow: "Voor wie", title: "Voor wie *we werken*" },
      [
        "- Kopers die hun wagen bij BVB Automotive kochten en het onderhoud graag in huis houden.",
        "- Eigenaars van VAG- en BMW-modellen uit de regio die een specialist zoeken voor hun jaarlijkse onderhoud.",
        "- Particulieren die een Gyeon-detailing willen, ook voor wagens die ze niet bij ons kochten.",
        "- Liefhebbers van sportieve wagens die een uitlaatsysteem of schroefset willen laten monteren.",
      ],
      images.coatingProduct,
      { position: "Links" },
    ),
    logoStrip("Merken waarmee *we werken*", [
      logo(logos.gyeon, "Gyeon Certified Studio"),
      logo(logos.rowe, "ROWE"),
      logo(logos.akrapovic, "Akrapovič"),
      logo(logos.remus, "Remus"),
      logo(logos.milltek, "Milltek Sport"),
    ]),
    cta(
      "Plan uw afspraak *tijdig*",
      "Meestal kunt u binnen de week terecht. Bel ons of vraag een offerte aan via het contactformulier, dan houden we de wachttijd kort.",
      { btns: buttons(["Vraag een offerte", "contact"]) },
    ),
  ],
  {
    title: "Werkplaats: detailing, onderhoud, uitlaat en schroefsets",
    description:
      "De werkplaats van BVB Automotive in Geel: Gyeon-detailing, onderhoud en herstelling van VAG en BMW, uitlaatsystemen en schroefsets.",
  },
);

const coating = page(
  "keramische-coating",
  "Keramische coating",
  [
    hero(
      "Detailing · Gyeon Certified Studio",
      "Keramische coating in Geel",
      [
        "Een keramische coating is een harde, transparante laag die zich aan uw lak hecht. Ze beschermt tegen vuil, uv-licht en strooizout, en uw wagen wordt veel makkelijker om te wassen. Als één van de weinige Gyeon Certified Studios in België werken we met coatings en protocollen die buiten het netwerk niet verkrijgbaar zijn.",
      ],
      images.studioPorsche,
      buttons(["Vraag een offerte", "contact"]),
    ),
    textMedia(
      { eyebrow: "Het probleem", title: "Waar coatings misgaan" },
      [
        "Het woord 'coating' wordt ruim gebruikt. Een carwash verkoopt een keramische spray. Een poetsdienst aan huis brengt een sealant aan en noemt het een coating. U betaalt voor jaren bescherming en krijgt er een paar maanden.",
        "We zien ook vaak coatings die op vuile of ongepoetste lak zijn aangebracht, of die buiten moesten uitharden in regen en stof. Het ligt zelden aan de goede bedoelingen, wel aan een gebrek aan opleiding en vakkennis.",
        "### Waarom dat uitmaakt",
        "Een coating sluit af wat eronder zit. Swirls en krasjes die niet eerst weggepoetst worden, zitten daarna jarenlang vast onder de laag. Een slecht aangebrachte coating slijt ongelijk en krijgt vlekken, en dan ziet uw lak er slechter uit dan voordien. Een uitgeharde coating krijgt u er alleen af door opnieuw te polijsten.",
        "**Kortom: een goedkope of slecht aangebrachte coating kost u uiteindelijk meer dan een correcte.**",
      ],
      images.polishing,
    ),
    textMedia(
      { eyebrow: "Onze aanpak", title: "Elke twee jaar opnieuw gekeurd" },
      [
        "Gyeon Certified Studio word je niet door een formulier in te vullen. Je moet een fysieke audit doorstaan, je mensen laten opleiden en minstens één behandeling onder toezicht uitvoeren.",
        "Wij hebben dat traject doorlopen, en Gyeon controleert onze certificering elke twee jaar opnieuw. Onze werkplaats en onze mensen voldoen dus aan de standaard van Gyeon zelf, niet aan een standaard die we zelf bedacht hebben.",
      ],
      images.coatingProduct,
      { position: "Links", tone: "Donker" },
    ),
    steps({ eyebrow: "De procedure", title: "Zes stappen, elke keer" }, [
      [
        "Lakinspectie en offerte",
        "Samen bekijken we de lak onder professionele verlichting en bepalen we wat nodig is. U krijgt een eerlijke offerte voor we beginnen.",
      ],
      [
        "Wassen en decontamineren",
        "Een wasbeurt in twee stappen, daarna halen we vliegroest, teer en vastzittend vuil van de lak. Een coating hecht alleen goed op een volledig schone ondergrond.",
      ],
      [
        "Lakcorrectie",
        "Swirls en krasjes polijsten we weg voor de coating erop gaat. Hoeveel polijstwerk nodig is, hangt af van de staat van uw lak.",
      ],
      [
        "Coating aanbrengen",
        "We brengen de Gyeon-coating aan volgens het officiële protocol en laten ze uitharden in onze werkplaats, niet buiten.",
      ],
      [
        "Ramen, velgen en interieur",
        "Optioneel: een coating op ramen en velgen, en een beschermende behandeling voor leder en stof.",
      ],
      [
        "Aflevering en nacontrole",
        "U krijgt uitleg over het onderhoud, zodat de coating zo lang mogelijk meegaat. Na een week bekijken we samen het resultaat.",
      ],
    ]),
    slice("gallery", {
      eyebrow: "Uit de studio",
      title: h("Detailing *in beeld*"),
      intro: [],
      images: detailingGallery.map((image) => ({ image, caption: null })),
    }),
    stats([
      ["Gyeon", "Certified Studio, elke twee jaar geaudit"],
      ["100+", "wagens behandeld sinds de opening"],
      ["100%", "Gyeon-producten, geen tussenmerken"],
    ]),
    reviews("Wat klanten na hun *coating* zeiden", "Reviews van detailingklanten op AutoScout24.", [
      {
        quote:
          "Perfecte service! Ian weet wat hij doet en heeft een passie voor zijn vak. Ik heb mijn GTI laten detailen, interieur en exterieur. Hij doet meer dan verwacht.",
        name: "",
        date: null,
      },
      {
        quote:
          "Heb mijn nieuwe wagen hier laten coaten. Super goed en professioneel gedaan! Ian heeft dit echt tot in de puntjes afgewerkt.",
        name: "",
        date: null,
      },
    ]),
    faq("Veelgestelde vragen", "Vragen over coating", [
      [
        "Wat is het verschil tussen een coating, een wax en een sealant?",
        [
          "Een wax ligt bovenop de lak en is na enkele weken tot maanden uitgewerkt. Een sealant is een synthetische variant die iets langer meegaat, meestal enkele maanden.",
          "Een keramische coating hecht zich chemisch aan de lak en hardt uit tot een harde, transparante laag. Daardoor beschermt ze niet maanden maar jaren, en is ze veel beter bestand tegen vuil, uv-licht en strooizout.",
        ],
      ],
      [
        "Hoe lang gaat een keramische coating mee?",
        [
          "Dat hangt af van de coating en vooral van het onderhoud. Een professionele Gyeon-coating die goed onderhouden wordt, beschermt uw lak meerdere jaren.",
          "Wie wekelijks door een carwash met borstels rijdt, verkort die levensduur sterk. Bij de aflevering krijgt u een eerlijke inschatting voor uw wagen en uw manier van rijden.",
        ],
      ],
      [
        "Heeft een nieuwe wagen ook een coating nodig?",
        [
          "Een nieuwe wagen is net het ideale moment: de lak is nog in goede staat, dus u beschermt hem voor de eerste krassen en vlekken er zijn.",
          "Ook nieuwe wagens hebben vaak al fijne krasjes van het transport of de eerste wasbeurt bij de dealer. Die controleren we eerst onder professionele verlichting en poetsen we zo nodig weg.",
        ],
      ],
      [
        "Beschermt een coating tegen steenslag en krassen?",
        [
          "Nee. Een coating maakt de lak beter bestand tegen fijne waskrasjes, vogelpoep, insecten en strooizout, maar ze houdt geen steenslag of diepe krassen tegen. We zeggen dat liever vooraf dan dat u achteraf teleurgesteld bent.",
        ],
      ],
      [
        "Wanneer mag ik mijn wagen voor het eerst wassen?",
        [
          "Een coating heeft na het aanbrengen nog tijd nodig om volledig uit te harden. Reken op ongeveer een week zonder wasbeurt. Bij de aflevering krijgt u de exacte richtlijnen mee.",
        ],
      ],
      [
        "Mag ik met een gecoate wagen naar de carwash?",
        [
          "Liever niet: de borstels maken krasjes en verkorten de levensduur van de coating.",
          "Was uw wagen het best met de hand, met een pH-neutrale shampoo en twee emmers. Een contactloze wasbeurt met hogedruk kan wel. Dankzij de coating gaat wassen ook veel sneller dan vroeger.",
        ],
      ],
      [
        "Hoe lang blijft mijn wagen bij jullie?",
        [
          "Dat hangt vooral af van hoeveel lakcorrectie nodig is en welke opties u kiest. Meestal gaat het om enkele dagen, omdat de coating ook bij ons in de werkplaats moet uitharden. U krijgt de planning samen met de offerte.",
        ],
      ],
      [
        "Wat kost een keramische coating?",
        [
          "Dat hangt af van de grootte van uw wagen, de staat van de lak en de opties die u kiest, zoals een coating op ramen, velgen, leder of stof.",
          "Stuur ons foto's van uw wagen en laat weten wat u zoekt. Binnen 24 uur krijgt u een offerte op maat, zonder verplichting.",
        ],
      ],
      [
        "Kan ik een coating niet gewoon zelf aanbrengen?",
        [
          "Dat kan, maar het meeste werk zit in de voorbereiding: wassen, decontamineren en polijsten. Slaat u dat over, dan zitten vuil en krasjes jarenlang vast onder de coating.",
          "Coatings uit de winkel gaan bovendien minder lang mee. De professionele Gyeon-coatings die wij gebruiken, zijn alleen verkrijgbaar voor gecertificeerde studio's.",
        ],
      ],
      [
        "Coaten jullie ook wagens die niet bij jullie gekocht zijn?",
        ["Ja. Iedereen kan bij ons terecht voor een keramische coating, waar de wagen ook gekocht is."],
      ],
    ]),
    quoteCta("coating"),
  ],
  {
    title: "Keramische coating in Geel · Gyeon Certified Studio",
    description:
      "Keramische coating door een Gyeon Certified Studio in Geel: lakinspectie, lakcorrectie en coating volgens het officiële Gyeon-protocol. Offerte binnen 24 uur.",
  },
);

const service = page(
  "service-herstelling",
  "Service & herstelling",
  [
    hero(
      "Service & herstelling",
      "Onderhoud en herstelling",
      [
        "Onze werkplaats doet onderhoud en herstellingen voor VAG-modellen (Audi, Volkswagen, Cupra, Seat en Škoda) en BMW's. Dealerkennis zonder dealertarief, en vakkennis die u merkt bij de eerste diagnose.",
      ],
      images.engineBay,
      buttons(["Plan onderhoud", "contact"]),
    ),
    textMedia(
      { eyebrow: "Herkenbaar?", title: "De afspraak die niemand wil" },
      [
        "Periodiek onderhoud is zelden een afspraak waar iemand naar uitkijkt. Tussen de dealer en de garage om de hoek kiest u meestal de minst slechte optie, en vaak zonder genoeg informatie om dat met vertrouwen te doen.",
        "- Onvoorspelbare kosten",
        "- Vage offertes met 'mogelijk extra werk'",
        "- Dealers die structureel duurder zijn",
        "- Garages zonder merkspecifieke diagnose",
      ],
      images.bmwWheel,
    ),
    features(
      { eyebrow: "Onze aanpak", title: "Vier dingen die verschillen" },
      [
        {
          title: "Uitlezing per merk",
          text: "We werken met VAG- en BMW-specifieke diagnosesoftware, niet met een universele scanner die de helft van de foutcodes mist. Dat scheelt diagnosetijd, en soms ook herstelkosten.",
        },
        {
          title: "Vaste offerte vooraf",
          text: "U krijgt een schriftelijke offerte voor we beginnen. Moet er tijdens het werk iets extra gebeuren, dan bellen we eerst en gaan we pas verder met uw akkoord.",
        },
        {
          title: "Dealerniveau, zonder dealertarief",
          text: "Onze mensen zijn opgeleid op de modellen die we verkopen. Voor eigenaars van een VAG of BMW is dat een groot verschil in wachttijd en in eindfactuur.",
        },
        {
          title: "Eigen werkplaats",
          text: "Wie bij ons kocht, blijft voor onderhoud in huis. Eén aanspreekpunt voor aankoop en onderhoud: uw wagen blijft letterlijk bij dezelfde mensen.",
        },
      ],
      { layout: "Genummerd", tone: "Donker" },
    ),
    textMedia({ eyebrow: "Duitse topkwaliteit", title: "Waarom ROWE-motorolie" }, [
      "De gezondheid van uw motor staat voorop. Daarom werken we resoluut met ROWE-motorolie. Dit Duitse merk staat wereldwijd bekend om zijn compromisloze kwaliteit, zijn innovatieve technologie en zijn uitstekende smeereigenschappen.",
    ]),
    stats([
      ["VAG & BMW", "Onze monteurs zijn opgeleid op de modellen die we verkopen"],
      ["100+", "wagens voorbereid en afgeleverd"],
      ["Gyeon", "Certified Studio in dezelfde werkplaats"],
      ["4,94/5", "op AutoScout24"],
    ]),
    features(
      {
        eyebrow: "Wat we doen",
        title: "Onze diensten *in één overzicht*",
        intro: [
          "Staat uw vraag er niet tussen? Vraag het gerust. Wat we zelf niet doen, verwijzen we correct door. Een eerlijk antwoord kost niets.",
        ],
      },
      [
        {
          icon: "Vinkje",
          title: "Periodiek onderhoud",
          text: "Volgens fabrieksvoorschrift, voor alle intervallen.",
        },
        { icon: "Vinkje", title: "Remmen en ophanging", text: "Remmen, wielophanging en uitlaatsystemen." },
        { icon: "Vinkje", title: "Olie en filters", text: "Olie- en filtervervanging met ROWE-motorolie." },
        { icon: "Vinkje", title: "Diagnose", text: "Foutcodes uitlezen met merkspecifieke software." },
        {
          icon: "Vinkje",
          title: "Technische keuring",
          text: "Uw wagen klaarmaken voor de technische keuring.",
        },
        { icon: "Vinkje", title: "Banden", text: "Bandenservice en wintersets." },
      ],
      { layout: "Lijst", columns: "3" },
    ),
    cta(
      "Meestal *binnen de week* terecht",
      "Voor grotere ingrepen werken we met een vaste planning, zodat uw wagen niet langer dan nodig stilstaat. Bel ons of vraag een offerte aan.",
      { btns: buttons(["Afspraak maken", "contact"]) },
    ),
  ],
  {
    title: "Onderhoud en herstelling VAG en BMW in Geel",
    description:
      "Onderhoud en herstelling van Audi, Volkswagen, Cupra, Seat, Škoda en BMW in Geel. Merkspecifieke diagnose, vaste offerte vooraf en ROWE-motorolie.",
  },
);

const uitlaat = page(
  "uitlaatsystemen",
  "Uitlaatsystemen",
  [
    hero(
      "Uitlaatsystemen",
      "Uitlaatsystemen op maat",
      [
        "Een uitlaatsysteem kiest u niet alleen op geluid. Het bepaalt mee hoe uw wagen aanvoelt tussen 3.000 en 6.000 toeren, hoe hij klinkt bij een koude start en of hij door de technische keuring raakt. Wij adviseren, monteren en stellen af, met focus op VAG-sport en de BMW M-reeks.",
      ],
      images.akraTip,
      buttons(["Vraag advies", "contact"]),
    ),
    textMedia(
      { eyebrow: "Het probleem", title: "Waar aftermarket misgaat" },
      [
        "Online vindt u honderden uitlaatsystemen voor elke populaire sportwagen. De foto's zien er allemaal goed uit en elk geluidsfragment klinkt 'agressief'.",
        "Toch eindigen veel eigenaars met een systeem dat dreunt op de autostrade, resonanties geeft die er op de dag van de montage nog niet waren, of dat de wagen laat afkeuren omdat de geluidsgrens overschreden is.",
        "**Een uitlaatsysteem vraagt advies bij de keuze, vakmanschap bij de montage en een correcte afstelling. Drie dingen die online bestellen niet oplost.**",
      ],
      images.m2Exhaust,
    ),
    features(
      {
        eyebrow: "Onze aanpak",
        title: "Van keuze tot montage",
        intro: [
          "Dankzij onze ervaring met performante VAG- en BMW-modellen begeleiden we u van de productkeuze tot de installatie, afgestemd op uw rijstijl en verwachtingen.",
        ],
      },
      [
        {
          title: "Advies op maat van uw gebruik",
          text: "Dagelijks rijden of af en toe het circuit op? Vooral autostrade of lokaal? Dat bepaalt welk systeem bij u past. We helpen u kiezen voor u geld uitgeeft.",
        },
        {
          title: "Montage door ervaren monteurs",
          text: "Een cat-back monteren lijkt eenvoudig, maar vraagt het juiste aanhaalmoment, de juiste pakkingen en een controle op de ophanging. We hebben er tientallen gemonteerd en weten waar ze lekken.",
        },
        {
          title: "Afstelling en controle",
          text: "Na de montage controleren we op geluid en lekken, en stellen we de ECU af waar nodig. Moet uw wagen jaarlijks naar de keuring, dan raden we systemen aan die hun homologatie behouden.",
        },
        {
          title: "Focus op VAG-sport en BMW M",
          text: "We doen niet 'alle merken uitlaatsystemen'. We kennen de Golf R, RS3, Cupra Leon en de BMW M-modellen door en door, en adviseren systemen die daarbij passen.",
        },
      ],
      { layout: "Lijst" },
    ),
    logoStrip(
      "Merken waarmee *we werken*",
      [logo(logos.akrapovic, "Akrapovič"), logo(logos.remus, "Remus"), logo(logos.milltek, "Milltek Sport")],
      [
        "Bekende Europese merken die we zelf gebruikt en getest hebben. Geen exclusieve contracten: we adviseren wat bij uw wagen en uw budget past.",
      ],
    ),
    steps({ eyebrow: "Werkwijze", title: "Van advies *tot aflevering*" }, [
      ["Adviesgesprek", "Samen bespreken we uw wensen en hoe u met de wagen rijdt."],
      ["Offerte", "Een duidelijke prijs voor het systeem, de montage en de arbeid."],
      ["Bestelling en planning", "We contacteren u zodra het systeem binnen is."],
      ["Montage", "In onze werkplaats, in één tot twee werkdagen, afhankelijk van het systeem."],
      ["Afstelling en controle", "Lekcontrole en, waar nodig, een ECU-afstelling."],
      ["Aflevering", "Met uitleg over het onderhoud en de homologatiepapieren."],
    ]),
    quoteCta("uitlaatmontage"),
  ],
  {
    title: "Performance-uitlaatsystemen in Geel",
    description:
      "Advies, montage en afstelling van performance-uitlaatsystemen van Akrapovič, Remus en Milltek voor VAG-sport en BMW M-modellen.",
  },
);

const schroefsets = page(
  "schroefsets",
  "Schroefsets & verlaging",
  [
    hero(
      "Schroefsets & verlaging",
      "Schroefsets en verlaging",
      [
        "Een schroefset kiest u niet alleen op uitzicht. Hij bepaalt mee hoe uw wagen op de weg ligt, hoe uw banden slijten en hoe hij zich gedraagt in een bochtige rit. Wij monteren en lijnen schroefsets uit voor wie wil verlagen zonder aan rijkwaliteit in te boeten.",
      ],
      images.lowered,
      buttons(["Vraag advies", "contact"]),
    ),
    textMedia(
      { eyebrow: "Het probleem", title: "Wat er misgaat *bij de montage*" },
      [
        "Een schroefset bestellen en ergens laten monteren, klinkt eenvoudig. Tot u merkt dat uw banden aan de binnenkant slijten, dat de wagen onrustig ligt in bochten, of dat uw stuur scheef staat na een verkeersdrempel.",
        "**Het verschil zit zelden in het onderdeel. Het zit bijna altijd in de uitlijning en de afstelling na de montage.**",
      ],
      images.alignment,
    ),
    features(
      {
        eyebrow: "Onze aanpak",
        title: "Wat we *anders doen*",
        intro: [
          "Dankzij onze ervaring met VAG- en BMW-modellen krijgt u een correct gemonteerde en uitgelijnde ophanging, afgestemd op uw wagen en uw rijgedrag.",
        ],
      },
      [
        {
          title: "Montage en uitlijning altijd samen",
          text: "Een schroefset zonder professionele uitlijning is weggegooid geld. Bij ons zit de vierwieluitlijning standaard in de offerte.",
        },
        {
          title: "De juiste hoogte",
          text: "We raden een verlaging aan die past bij uw wagen en uw gebruik. Te laag voor dagelijks gebruik betekent schade aan de bodem en weinig comfort. We helpen u de juiste balans te vinden.",
        },
        {
          title: "Focus op VAG-sport en BMW",
          text: "We werken vooral met modellen uit onze eigen specialisatie. We weten welke schroefset bij welk onderstel past, en welke combinaties we afraden.",
        },
        {
          title: "Geen onderdelen opgedrongen",
          text: "We adviseren wat bij uw wagen past, ook als dat een eenvoudigere set is. U betaalt niet voor wat u niet nodig hebt.",
        },
      ],
      { layout: "Lijst" },
    ),
    steps({ eyebrow: "Werkwijze", title: "Van advies *tot aflevering*" }, [
      ["Adviesgesprek", "Merk, model en hoe u met de wagen rijdt."],
      ["Offerte", "Schroefset (als u die via ons bestelt), montage en uitlijning."],
      ["Montage", "In onze werkplaats, in één werkdag."],
      ["Vierwieluitlijning", "Twee weken na de montage, als de veren zich gezet hebben."],
      ["Testrit", "U krijgt de wagen pas terug nadat we er zelf mee gereden hebben."],
    ]),
    quoteCta("schroefsetmontage"),
  ],
  {
    title: "Schroefsets en verlaging in Geel",
    description:
      "Schroefsets en verlaging voor sportieve VAG- en BMW-modellen, vakkundig gemonteerd en altijd met een vierwieluitlijning.",
  },
);

const transport = page(
  "autotransport",
  "Autotransport",
  [
    hero(
      "Autotransport België",
      "Autotransport in België",
      [
        "Op zoek naar betrouwbaar autotransport in België? BVB Automotive vervoert personenwagens met onze eigen Iveco Daily-autotransporter of autotrailer, voor particulieren en voor professionele klanten.",
      ],
      images.transport,
      buttons(["Vraag uw transport aan", "contact"]),
    ),
    textMedia(
      { eyebrow: "Wat we doen", title: "Uw wagen, ons transport" },
      [
        "Een pas gekochte wagen, een voertuig dat naar de garage moet of een auto die ergens anders afgeleverd moet worden: vanuit Geel rijden we door heel België. Dankzij onze ervaring in de autosector weten we wat er bij het vervoer van een wagen komt kijken, en behandelen we elke wagen met de nodige zorg.",
        "### Geschikt voor onder meer",
        "- **Aangekochte wagens**: laat uw nieuwe aankoop veilig naar huis of naar uw bedrijf brengen.",
        "- **Transport tussen garages en handelaars**: een praktische oplossing voor professionals uit de autosector.",
        "- **Levering op locatie**: uw wagen wordt op een afgesproken plaats afgeleverd.",
        "- **Sport- en premiumwagens**: extra aandacht bij het laden, vervoeren en lossen.",
        "- **Transport naar een werkplaats**: uw wagen naar een garage of een andere gewenste locatie.",
      ],
      images.golfGti,
    ),
    features(
      { eyebrow: "Waarom BVB", title: "Waarom BVB Automotive" },
      [
        {
          icon: "Wagen",
          title: "Kennis van wagens",
          text: "We werken elke dag in de autosector en weten hoe belangrijk een correcte behandeling van een wagen is.",
        },
        {
          icon: "Persoon",
          title: "Rechtstreeks contact",
          text: "U weet met wie u zaken doet. We bespreken het transport vooraf en maken duidelijke afspraken over ophaling, bestemming en timing.",
        },
        {
          icon: "Locatie",
          title: "Doorheen heel België",
          text: "Vanuit Geel rijden we naar alle regio's van België. De prijs hangt af van de afstand en de opdracht.",
        },
        {
          icon: "Schild",
          title: "Zorg voor uw wagen",
          text: "Van laden tot lossen behandelen we uw wagen met de nodige aandacht. Zorgvuldigheid staat voorop.",
        },
      ],
      { tone: "Donker" },
    ),
    contactForm(
      "Transport *aanvragen*",
      "Vermeld het merk en model, de ophaallocatie en de bestemming, de gewenste datum en eventuele bijzonderheden over de staat of bereikbaarheid van de wagen. U krijgt een prijsvoorstel op maat.",
      "Autotransport",
      "Aanvraag",
    ),
  ],
  {
    title: "Autotransport in België",
    description:
      "Professioneel autotransport in heel België met onze Iveco Daily-autotransporter of autotrailer, voor particulieren en professionals. Vraag een prijsvoorstel.",
  },
);

const about = page(
  "over-ons",
  "Over ons",
  [
    hero(
      "Over ons",
      "Begonnen met één Golf GTI",
      ["Hoe een privégarage in de Kempen uitgroeide tot een adres voor sportieve VAG- en BMW-wagens."],
      images.firstGolf,
    ),
    textMedia(
      { eyebrow: "Ons verhaal", title: "Het begon met *één Golf GTI*" },
      [
        "BVB Automotive begon in een privégarage, met één Golf GTI die vroeg om een paar extra uren werk voor de levering.",
        "Die drang naar net dat beetje meer is gebleven. Vandaag staat in onze showroom in Geel een zorgvuldig geselecteerd aanbod VAG- en BMW-wagens, elk voorbereid door dezelfde handen als die eerste Golf.",
        "Wat in onze voorraad komt, kopen we zoals we zelf zouden kopen: met een controle van onderhoudshistoriek, schadeverleden, kilometerstand en marktprijs. En wat we afleveren, leveren we af zoals we het zelf zouden willen ontvangen: technisch nagekeken, met Car-Pass en gedetailleerd tot op showroomniveau.",
      ],
      images.golfGti,
    ),
    features(
      {
        eyebrow: "Onze achtergrond",
        title: "Waar onze kennis *vandaan komt*",
        intro: [
          "Een tweedehandswagen kopen is vertrouwen schenken aan iemand van wie u de werkplaats nooit gezien hebt. Daarom laten we graag zien waar we vandaan komen.",
        ],
      },
      [
        {
          title: "Detailing als vertrekpunt",
          text: "We zijn begonnen als detailingspecialist en zijn Gyeon Certified Studio, één van de weinige in België. We weten wat er onder de lak zit voor we over de lak oordelen.",
        },
        {
          title: "Eigen werkplaats in Geel",
          text: "Elke wagen die binnenkomt, wordt door onze eigen monteurs nagekeken. Wat u koopt, hebben wij van binnenuit gezien.",
        },
        {
          title: "Specialisatie in VAG en BMW",
          text: "Geen handelaar die 'alles' verkoopt. We kopen in wat we kennen, en we kennen wat we inkopen.",
        },
      ],
      { layout: "Genummerd", tone: "Donker" },
    ),
    stats(
      [
        ["Gyeon", "Certified Studio"],
        ["4,94/5", "op AutoScout24"],
        ["VAG & BMW", "als kern van onze voorraad"],
      ],
      "Licht",
    ),
    textMedia(
      { eyebrow: "Detailing", title: "Gyeon Certified Studio" },
      [
        "BVB Automotive is één van de weinige Gyeon Certified Studios in België. Voor u als klant betekent dat: als uw wagen onze showroom verlaat, is hij behandeld met producten die alleen gecertificeerde studio's mogen aanbrengen. Daarom zien onze wagens er na een jaar nog uit zoals op de dag van de aflevering.",
        "Certificering betekent dat we werken volgens de eigen protocollen van Gyeon en door Gyeon zelf zijn opgeleid. Dat hernieuwen we elke twee jaar.",
        "**De meeste handelaars wassen uw wagen. Wij detailen hem. Het verschil ziet u zes maanden later, als de lak er nog altijd uitziet als op dag één.**",
      ],
      images.studio,
      { position: "Links", btns: buttons(["Meer over onze detailing", "keramische-coating"]) },
    ),
    features({ eyebrow: "Waar we voor staan", title: "Drie principes, *van A tot Z*" }, [
      {
        icon: "Zoeken",
        title: "Specifiek boven breed",
        text: "We verkopen liever twintig wagens die we van A tot Z kennen dan tweehonderd die we enkel doorschuiven.",
      },
      {
        icon: "Euro",
        title: "Eerlijke prijzen",
        text: "Een marktconforme prijs komt uit een grondige controle. We vragen de prijs die we zelf zouden willen betalen.",
      },
      {
        icon: "Persoon",
        title: "Eigen verantwoordelijkheid",
        text: "Gaat er iets mis, dan lost één telefoontje het op. Geen doorverwijzing naar derden, geen ticketsysteem.",
      },
    ]),
    location,
  ],
  {
    title: "Over BVB Automotive",
    description:
      "Het verhaal van BVB Automotive: van privégarage in de Kempen tot specialist in sportieve VAG- en BMW-wagens, met eigen werkplaats en Gyeon Certified Studio.",
  },
);

const vragen = page(
  "veelgestelde-vragen",
  "Veelgestelde vragen",
  [
    hero(
      "Veelgestelde vragen",
      "Geen vraag *is te klein*",
      [
        "Hieronder vindt u de antwoorden die het vaakst terugkomen: over ons aanbod, de aankoop, garantie, financiering en onze werkplaats. Staat uw vraag er niet tussen? Bel ons of stuur een bericht.",
      ],
      noImage,
    ),
    faq("Aanbod", "Over ons *aanbod*", [
      [
        "Kan ik een wagen online reserveren?",
        [
          "Nog niet rechtstreeks. Wel telefonisch of via WhatsApp. Een mondelinge reservatie houden we 48 uur voor u vast.",
        ],
      ],
      [
        "Hoe snel wisselt jullie voorraad?",
        [
          "Gemiddeld verlaten twee à drie wagens per week onze showroom. Ziet u iets dat bij u past, wacht dan niet te lang. We reserveren op afspraak.",
        ],
      ],
      [
        "Doen jullie import op aanvraag?",
        [
          "Ja. Zoekt u een specifieke wagen die niet in onze voorraad staat, dan bekijken we samen de mogelijkheden. We hebben contacten in Duitsland en Nederland, en Car-Pass, btw-situatie en eventuele kosten leggen we vooraf helder uit. [Neem contact op](page:contact) voor een aanvraag.",
        ],
      ],
      [
        "Zijn jullie gespecialiseerd in bepaalde merken?",
        [
          "Ja. Onze kernvoorraad bestaat uit VAG-modellen (Audi, Volkswagen, Cupra, Seat en Škoda) en BMW's. We kopen daar bewust op in, omdat we die merken door en door kennen. Bekijk onze [VAG Specialist Selectie](page:vag-specialist) of de [BMW-selectie](page:bmw).",
        ],
      ],
    ]),
    faq("Aankoop", "Het *aankoopproces*", [
      [
        "Hoe zit het met de Car-Pass?",
        [
          "Elke wagen die u bij ons koopt, krijgt bij de aflevering een geldige Car-Pass. Die is wettelijk verplicht bij de verkoop en toont de officiële kilometerhistoriek.",
        ],
      ],
      [
        "Leveren jullie thuis of op locatie?",
        [
          "Ja, op afspraak. Woont u verder dan 30 kilometer van Geel, dan bespreken we vooraf de voorwaarden. Bij premiummodellen is dat meestal kosteloos.",
        ],
      ],
      [
        "Nemen jullie mijn huidige wagen in?",
        [
          "Ja. Koopt u een wagen uit ons aanbod, dan nemen we uw huidige wagen in. U krijgt een eerlijke waarde op basis van onze eigen inschatting en de actuele marktprijs, geen vast tarief. Zie ook [Verkoop uw wagen](page:verkoop-uw-wagen).",
        ],
      ],
      [
        "Kan ik een proefrit maken?",
        [
          "Ja, op afspraak. Een proefrit bij ons duurt minstens twintig minuten en gaat standaard ook over de autostrade, zodat u de wagen voelt zoals u hem thuis zult rijden. Meerdere proefritten op één dag kan ook.",
        ],
      ],
    ]),
    faq("Garantie & service", "Garantie en *service*", [
      [
        "Welke garantie krijg ik bij aankoop?",
        [
          "Elke wagen verlaat onze showroom met een duidelijk uitgeschreven garantie. De duur en de voorwaarden leggen we per wagen vast, afhankelijk van leeftijd, kilometerstand en gebruik. U krijgt de garantie altijd op papier, nooit enkel mondeling.",
        ],
      ],
      [
        "Wat als er na de aankoop iets misgaat?",
        [
          "Dan lost één telefoontje het op. Omdat we een eigen werkplaats in Geel hebben, hoeft u voor onderhoud of herstelling binnen de garantie niet naar een externe partij. Dat is zeldzaam bij tweedehandshandelaars, en een belangrijke reden waarom klanten terugkomen.",
        ],
      ],
      [
        "Moet mijn wagen bij jullie in onderhoud blijven?",
        [
          "Nee, dat is niet verplicht. We raden het wel aan, zeker voor VAG- en BMW-modellen, omdat onze werkplaats merkspecifieke diagnosesoftware heeft die gewone garages niet hebben. Zie ook [Service & herstelling](page:service-herstelling).",
        ],
      ],
    ]),
    faq("Financiering", "Betalen en *financieren*", [
      [
        "Bieden jullie financiering aan?",
        [
          "Ja. We werken samen met een gespecialiseerde partner voor autofinanciering. Op onze [financieringspagina](page:financiering) vindt u indicatieve bedragen per prijsklasse en kunt u vrijblijvend een offerte aanvragen.",
        ],
      ],
      [
        "Kan ik cash betalen?",
        [
          "Cash kan tot € 3.000. Dat is de wettelijke grens voor contante betalingen aan een professionele verkoper in België. Voor het resterende bedrag is een overschrijving of financiering nodig.",
        ],
      ],
      [
        "Werken jullie met leasing voor bedrijven?",
        [
          "We kunnen u doorverwijzen naar een leasingpartner voor zakelijke klanten. Bespreek het vooraf, dan stippelen we samen de juiste weg uit.",
        ],
      ],
    ]),
    faq("Werkplaats", "Over onze *werkplaats*", [
      [
        "Hoe snel kan ik terecht?",
        [
          "Voor onderhoud en detailing meestal binnen de week. Voor grotere ingrepen, zoals een distributieriem, koppakking of performance-uitlaat, werken we met een vaste planning en krijgt u vooraf een datum.",
        ],
      ],
      [
        "Coaten jullie ook wagens die niet bij jullie gekocht zijn?",
        [
          "Ja. Als Gyeon Certified Studio coaten we ook wagens die u elders kocht. Hoe we te werk gaan, leest u op onze pagina over [keramische coating](page:keramische-coating).",
        ],
      ],
      [
        "Kan ik voor onderhoud komen als ik mijn wagen niet bij jullie kocht?",
        [
          "Ja. Onze werkplaats staat open voor alle eigenaars van een VAG of BMW uit de regio. Meer info vindt u bij [Service & herstelling](page:service-herstelling).",
        ],
      ],
    ]),
    faq("Verkoop uw wagen", "Uw wagen *verkopen*", [
      [
        "Ik wil mijn wagen verkopen. Kan ik bij jullie terecht?",
        [
          "Als uw wagen bij ons profiel past (een sportieve VAG of BMW met een duidelijke historiek), dan graag. Stuur foto's, de kilometerstand en onderhoudsinfo via [Verkoop uw wagen](page:verkoop-uw-wagen). Binnen 48 uur krijgt u een eerlijke indicatie.",
        ],
      ],
      [
        "Kopen jullie in een bepaalde prijsklasse in?",
        [
          "Niet strikt. We kopen zowel een instap-VAG als een performance-BMW. Voor de hele voorraad geldt wel: onderhoudshistoriek, schadeverleden, kilometerstand en marktprijs moeten kloppen.",
        ],
      ],
    ]),
    faq("Contact", "Contact en *bereikbaarheid*", [
      [
        "Wanneer zijn jullie open?",
        [
          "Op afspraak, ook 's avonds voor wie pas na het werk tijd heeft. Dringend? Bel of stuur een WhatsApp. We reageren meestal binnen 24 uur, vaak sneller.",
        ],
      ],
      [
        "Waar zijn jullie gevestigd?",
        [
          "In Geel, op vijf minuten van de E313, afrit Geel-West. Het exacte adres en de route vindt u op de [contactpagina](page:contact).",
        ],
      ],
      [
        "Spreken jullie ook andere talen?",
        ["Ja. Ian spreekt vlot Nederlands en Engels, en basis Frans op aanvraag."],
      ],
    ]),
    cta(
      "Staat uw vraag *er niet tussen*?",
      "Bel ons of stuur een WhatsApp. U krijgt Ian of Lucas rechtstreeks aan de lijn.",
    ),
  ],
  {
    title: "Veelgestelde vragen",
    description:
      "Antwoorden op de meest gestelde vragen over het aanbod, de aankoop, garantie, financiering en de werkplaats van BVB Automotive in Geel.",
  },
);

const contact = page(
  "contact",
  "Contact",
  [
    hero(
      "Contact",
      "Op afspraak in Geel",
      [
        "Een vraag over een wagen, een werkplaatsafspraak of een inruil? U krijgt Ian of Lucas rechtstreeks aan de lijn. Geen callcenter, geen ticketsysteem.",
      ],
      images.gt3,
    ),
    slice("contact", {
      eyebrow: "Contactopties",
      title: h("Zo bereikt u ons *het snelst*"),
      intro: rt(
        "We reageren binnen 24 uur op werkdagen, meestal veel sneller. Komt u op bezoek, dan staan er een parkeerplaats en koffie voor u klaar.",
      ),
      show_form: true,
      form_title: "Stuur ons een bericht",
      default_subject: "Informatie over een wagen",
    }),
    location,
  ],
  {
    title: "Contact",
    description:
      "Contacteer BVB Automotive in Geel: bel, stuur een WhatsApp of mail. Winkelom 83, unit C1, 2440 Geel. Bezoek op afspraak, ook 's avonds.",
  },
);

const sell = page(
  "verkoop-uw-wagen",
  "Verkoop uw wagen",
  [
    hero(
      "Verkoop uw wagen",
      "Verkoop uw wagen aan ons",
      [
        "We kopen sportieve VAG- en BMW-modellen rechtstreeks aan als ze bij ons profiel passen. Geen fotoshoot voor een advertentie, geen onbekenden op uw oprit, geen verloren tijd met proefritten. U stuurt foto's en info, binnen 48 uur hebt u een eerlijk bod, en u beslist.",
      ],
      images.x3mGrey,
      buttons(["Stuur uw gegevens", "contact"]),
    ),
    features(
      {
        eyebrow: "Zelf verkopen",
        title: "Wat zelf verkopen u *écht kost*",
        intro: [
          "Uw wagen zelf verkopen via een platform levert in theorie meer op. In de praktijk kost het u vaak meer dan u denkt. Een rechtstreekse verkoop aan een gespecialiseerde handelaar kost misschien 5 tot 10% van de eindprijs, maar in tijd, risico en gemoedsrust wint u meestal meer.",
        ],
      },
      [
        {
          icon: "Klok",
          title: "Tijd",
          text: "Foto's maken, een advertentie schrijven, bellers te woord staan, kijkers rondleiden en proefritten begeleiden.",
        },
        {
          icon: "Zoeken",
          title: "Onzekerheid",
          text: "Komt de koper terug op de prijs? Is de betaling echt binnen? Volgen er achteraf nog klachten?",
        },
        {
          icon: "Sleutel",
          title: "Onbekenden op uw oprit",
          text: "Vreemden met uw sleutels voor een proefrit. Dat vraagt vertrouwen, en een goede verzekering.",
        },
        {
          icon: "Kalender",
          title: "Weken zonder wagen",
          text: "Tussen de verkoop van uw oude en de aankoop van uw nieuwe wagen zitten soms weken zonder vervoer.",
        },
      ],
      { tone: "Donker" },
    ),
    features(
      { eyebrow: "Uw voordelen", title: "Wat u *bij ons* krijgt" },
      [
        {
          title: "Een eerlijk bod binnen 48 uur",
          text: "Stuur foto's, de kilometerstand, onderhoudsinfo en eventueel de Car-Pass. Binnen 48 uur krijgt u een concreet bedrag. Geen vork, maar één vaste prijs.",
        },
        {
          title: "Geen eindeloze onderhandeling",
          text: "Ons bod is meteen onze eindprijs. We bieden niet lager om ruimte te laten voor afdingen. Dat spaart tijd voor ons allebei.",
        },
        {
          title: "Snelle betaling",
          text: "Akkoord met de prijs? Dan staat het bedrag binnen 24 uur na de levering op uw rekening.",
        },
        {
          title: "Inruil bij aankoop",
          text: "Kiest u ook een wagen uit onze voorraad, dan zetten we de inruilwaarde meteen in mindering. Eén transactie, minder papierwerk.",
        },
      ],
      { layout: "Genummerd" },
    ),
    features(
      { eyebrow: "Het verschil", title: "Zelf adverteren of verkopen" },
      [
        {
          title: "Via een platform",
          text: [
            "**Een platform is advertentieruimte.**",
            "U concurreert met iedereen die dezelfde wagen verkoopt, u betaalt voor zichtbaarheid en u hoopt op de juiste koper.",
          ],
        },
        {
          title: "Rechtstreeks aan BVB Automotive",
          text: [
            "**Wij zijn de juiste koper.**",
            "We weten al waarom uw Cupra of BMW interessant is voor onze klanten, en hoeven hem niet met advertentiegeld aan een onbekende te verkopen. Daarom bieden we soms meer dan u verwacht: we kopen gericht in wat we weten te verkopen.",
          ],
        },
      ],
      { columns: "2" },
    ),
    features(
      { eyebrow: "Ons profiel", title: "Welke wagens *we aankopen*" },
      [
        {
          icon: "Vinkje",
          title: "VAG-sport",
          text: "Golf GTI en R, Polo GTI, Audi RS3, S3 en TT, Cupra Leon en Formentor, Seat Leon FR, Škoda Octavia RS.",
        },
        { icon: "Vinkje", title: "BMW", text: "1-, 3-, 4- en 5-reeks, en de M-modellen." },
        { icon: "Vinkje", title: "Premium", text: "Selectief, meestal met een sportief profiel." },
        {
          icon: "Document",
          title: "Voorwaarden",
          text: [
            "- Een duidelijke onderhoudshistoriek (Car-Pass of onderhoudsboekje)",
            "- Geen zware, verzwegen schade",
            "- Een kilometerstand die past bij de leeftijd",
          ],
        },
      ],
      { layout: "Lijst" },
    ),
    textMedia({ title: "Wat we *niet* aankopen" }, [
      "- Exotische oldtimers",
      "- Standaard gezinswagens zonder sportief profiel",
      "- Wagens zonder duidelijke papieren",
      "Past uw wagen niet in dat lijstje? Dan verwijzen we u graag door naar een collega-handelaar of een kanaal dat wel past.",
    ]),
    steps(
      {
        eyebrow: "Wat we nodig hebben",
        title: "Wat we nodig hebben",
        intro: ["Stuur alles via het formulier hieronder of via WhatsApp."],
      },
      [
        [
          "Foto's",
          "Het exterieur van alle kanten, het interieur, de koffer, het dashboard met zichtbare kilometerstand, en eventuele krassen of deukjes.",
        ],
        [
          "Basisinfo",
          "Merk, model, bouwjaar, kilometerstand, brandstof, handgeschakeld of automaat, en eventuele optiepakketten.",
        ],
        [
          "Onderhoudsinfo",
          "De laatste onderhoudsbeurt, de Car-Pass als u die hebt, en gekende herstellingen.",
        ],
        ["Uw vraagprijs", "Optioneel, als u al een bedrag in gedachten hebt."],
      ],
      "Donker",
    ),
    features(
      { eyebrow: "Waarom ons", title: "Waarom bij ons verkopen" },
      [
        { icon: "Vinkje", title: "Een rechtstreeks bod", text: "Zonder margetrucs." },
        { icon: "Vinkje", title: "Snel betaald", text: "Binnen 24 uur na ondertekening en levering." },
        {
          icon: "Vinkje",
          title: "Inruil in één transactie",
          text: "Administratief eenvoudig, gecombineerd met een aankoop uit onze voorraad.",
        },
        {
          icon: "Vinkje",
          title: "Lokaal en persoonlijk",
          text: "U hebt te maken met Ian zelf, niet met een tussenpersoon op afstand.",
        },
        {
          icon: "Vinkje",
          title: "Vrijblijvend",
          text: "Wilt u toch zelf verkopen? Prima. Dan weet u tenminste wat ons bod was.",
        },
      ],
      { layout: "Lijst", columns: "3" },
    ),
    contactForm(
      "Stuur ons *uw gegevens*",
      "Binnen 48 uur weet u wat we bieden, zonder verplichting. Foto's stuurt u het makkelijkst via WhatsApp.",
      "Inruil of verkoop van mijn wagen",
      "Waardebepaling",
    ),
  ],
  {
    title: "Verkoop uw wagen",
    description:
      "Verkoop uw sportieve VAG of BMW rechtstreeks aan BVB Automotive. Eerlijk bod binnen 48 uur, betaling binnen 24 uur, inruil mogelijk.",
  },
);

const finance = page(
  "financiering",
  "Financiering",
  [
    hero(
      "Financiering",
      "Helder gefinancierd",
      [
        "Een sportieve wagen kopen hoeft niet cash. We werken samen met een gespecialiseerde financieringspartner die snel beslist en geen verborgen kosten aanrekent. Hieronder ziet u per prijsklasse wat u ongeveer mag verwachten, zodat u al voor het gesprek weet waar u staat.",
      ],
      images.interior,
      buttons(["Vraag een offerte", "contact"]),
    ),
    textMedia({ eyebrow: "Herkenbaar?", title: "Het deel dat *niemand graag doet*" }, [
      "Financiering wordt meestal slecht uitgelegd. Een verkoper haalt er een formulier bij, vraagt naar uw loon en zet onderaan een bedrag. Wat de rente is, wat de totale kostprijs wordt of wat er gebeurt als u vroeger afbetaalt, weet u niet.",
      "Het resultaat: u tekent iets waarvan u pas bij de eerste domiciliëring beseft wat u eigenlijk hebt afgesproken. Dat is een slecht moment voor zo'n ontdekking.",
    ]),
    features(
      { eyebrow: "Onze aanpak", title: "Wat u bij ons *wél* krijgt" },
      [
        {
          icon: "Euro",
          title: "Vooraf een indicatie",
          text: "In de tabel hieronder ziet u per prijsklasse ongeveer wat u betaalt. Zonder formulier, gewoon om te weten wat haalbaar is.",
        },
        {
          icon: "Document",
          title: "Vaste offerte op papier",
          text: "Na een kort gesprek krijgt u binnen 48 uur een offerte met alles zwart op wit: rente, maandbedrag, looptijd en totale kostprijs.",
        },
        {
          icon: "Kalender",
          title: "Vervroegd aflossen",
          text: "Vervroegd aflossen is doorgaans mogelijk tegen redelijke kosten. Bespreek het vooraf als u denkt dat te doen.",
        },
        {
          icon: "Persoon",
          title: "Geen druk",
          text: "Is cash of een overschrijving beter voor u, dan zeggen we dat. We verdienen hetzelfde aan de wagen, gefinancierd of niet.",
        },
      ],
      { tone: "Donker" },
    ),
    slice("finance_table", {
      eyebrow: "Indicatieve maandbedragen",
      title: h("Wat u ongeveer *mag verwachten*"),
      intro: rt(
        "Richtbedragen op basis van een looptijd van 60 maanden en een standaardprofiel. Uw exacte cijfers hangen af van uw financiële profiel, aanbetaling en looptijd.",
      ),
      rows: [
        { price: "€ 15.000", down_payment: "€ 3.000", monthly: "± € 235", total: "± € 17.100" },
        { price: "€ 20.000", down_payment: "€ 4.000", monthly: "± € 315", total: "± € 22.900" },
        { price: "€ 25.000", down_payment: "€ 5.000", monthly: "± € 395", total: "± € 28.700" },
        { price: "€ 35.000", down_payment: "€ 7.000", monthly: "± € 555", total: "± € 40.300" },
        { price: "€ 50.000", down_payment: "€ 10.000", monthly: "± € 790", total: "± € 57.400" },
      ],
      note: rt(
        "**Let op:** deze bedragen zijn louter indicatief. De werkelijke rentevoet en kosten worden bepaald door de financieringspartner op basis van uw persoonlijke situatie. U bent tot niets verplicht zolang u geen offerte ondertekent.",
      ),
    }),
    features(
      {
        eyebrow: "Uw aanvraag",
        title: "Deze *documenten* hebt u nodig",
        intro: ["Met deze stukken hebt u binnen 48 uur een concrete offerte in uw mailbox."],
      },
      [
        { icon: "Vinkje", title: "Identiteitskaart", text: "Voor- en achterzijde." },
        {
          icon: "Vinkje",
          title: "Inkomen",
          text: "Uw laatste drie loonfiches, of recente boekhoudstukken als u zelfstandige bent.",
        },
        {
          icon: "Vinkje",
          title: "Lopende kredieten",
          text: "Eventueel een overzicht van uw huidige kredieten.",
        },
        {
          icon: "Vinkje",
          title: "Uw gekozen wagen",
          text: "De wagen uit onze voorraad die u wilt financieren.",
        },
      ],
      { layout: "Lijst" },
    ),
    features(
      { eyebrow: "Onze partner", title: "Waarom onze partner" },
      [
        { title: "Snelle beslissing", text: "Meestal binnen 48 uur een antwoord, vaak sneller." },
        { title: "Geen koppelverkoop", text: "U bent niet verplicht om extra verzekeringen af te sluiten." },
        {
          title: "Een lokale relatie",
          text: "We kennen onze contactpersoon. Is er iets, dan bellen we rechtstreeks.",
        },
        { title: "Een eerlijke rentevoet", text: "Marktconform, geen 'vanaf X%' met kleine lettertjes." },
      ],
      { layout: "Genummerd" },
    ),
    features(
      { eyebrow: "Cash of overschrijving", title: "Andere *betaalmogelijkheden*" },
      [
        {
          icon: "Euro",
          title: "Cash",
          text: "Tot € 3.000. Dat is de wettelijke grens voor contante betalingen aan een professionele verkoper in België.",
        },
        {
          icon: "Document",
          title: "Overschrijving",
          text: "Altijd mogelijk. De wagen wordt afgeleverd zodra het bedrag op onze rekening staat.",
        },
        {
          icon: "Vinkje",
          title: "Combinatie",
          text: "Een aanbetaling cash en de rest via overschrijving of financiering kan ook. We bekijken samen wat u het best past.",
        },
      ],
      { tone: "Donker" },
    ),
    contactForm(
      "Vraag vrijblijvend *uw offerte* aan",
      "Binnen 48 uur weet u wat uw wagen per maand echt kost. Twijfelt u tussen financieren en cash betalen? Eén telefoontje volstaat om het voor uw aankoop uit te rekenen, vaak in tien minuten.",
      "Financiering",
      "Offerte",
    ),
  ],
  {
    title: "Financiering van uw wagen",
    description:
      "Financier uw sportieve occasie bij BVB Automotive: indicatieve maandbedragen vooraf, een vaste offerte binnen 48 uur en geen verborgen kosten.",
  },
);

export const pageDocuments = [
  home,
  aanbod,
  vag,
  bmw,
  premium,
  werkplaats,
  coating,
  service,
  uitlaat,
  schroefsets,
  transport,
  about,
  vragen,
  contact,
  sell,
  finance,
];

export const seedDocuments = [settings, ...pageDocuments, ...carDocuments];
