# BVB Automotive

Website of BVB Automotive in Geel: sporty VAG and BMW used cars, an in-house workshop and a Gyeon
Certified Studio. Redesign of the old WordPress/WooCommerce site (bvbautomotive.be), in Dutch.

Built with Next.js 16 (App Router), Tailwind CSS 4 and Prismic (Slice Machine).

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
npm run slicemachine   # http://localhost:9999 — edit slices and content types
```

## Content

All content lives in the Prismic repository **bvb-automotive**.

| Type       | Route                                  | Notes                                             |
| ---------- | -------------------------------------- | ------------------------------------------------- |
| `settings` | –                                      | Menu, contact details, reviews, car page defaults |
| `page`     | `/` (uid `home`), `/:uid`, `/:parent/:uid` | Built from slices; optional parent page       |
| `car`      | `/aanbod/:uid`                         | One document per car                              |

Pages are composed from 16 slices in `src/slices` (hero, car grid, features, steps, reviews, FAQ,
contact, location, financing table, …). The **Wagens** slice shows cars automatically: the whole stock,
the featured cars, one collection (VAG, BMW & Mini, Premium & Performance) or the recently sold cars.

### Adding a car

1. In Prismic, create a **Wagen** document. The URL slug becomes `/aanbod/<slug>`.
2. Fill in brand, model, highlights (short, separated by `|`), price and VAT regime.
3. Add the photos under **Foto's**; the first photo is the main photo.
4. Fill in the **Specificaties** tab and list the options under **Uitrusting**, one per line.
5. Publish. The car appears in the stock, in its collection (by brand; tick *Premium & Performance*
   to add it there too) and, with *Uitlichten op de homepage*, on the homepage.

When a car is sold, set **Status** to *Verkocht*: it moves to "Recent verkocht" and its page stays online.
*Gereserveerd* shows a badge but keeps the car in the stock.

The financing estimate on car pages uses the rate, term and down payment under Settings → Wagens.

### Seed content and import

The content of the old site (16 pages and 44 cars with their photos) is in `src/seed`. It was pushed
to Prismic with the Migration API:

```bash
PRISMIC_WRITE_TOKEN=... npm run push:models                    # custom types and slices
PRISMIC_WRITE_TOKEN=... npm run seed:prismic -- --dry-run      # show the plan
PRISMIC_WRITE_TOKEN=... npm run seed:prismic                   # create missing documents
PRISMIC_WRITE_TOKEN=... npm run seed:prismic -- --update=home,contact   # also overwrite these
```

New and updated documents land in the **Migration release**; publish it in Prismic to make them live.
Publish before running the script again, because documents still in the release are not visible to it.
Existing documents that were edited in Prismic are never overwritten unless `--force` is passed.
Photos are downloaded from the old site once; images already in the media library are reused.

Until the repository has any published document, the site renders the seed content. To preview the
seed locally at any time: `PRISMIC_USE_SEED=true npm run dev`.

The car data was extracted from the WooCommerce Store API into `src/seed/cars.json` (specs parsed from
the descriptions and cleaned up). Old WordPress URLs redirect to the new ones (`next.config.ts`).

### Contact form

The form posts to `/api/contact`, which sends the message through [Resend](https://resend.com).
Set `RESEND_API_KEY`, `CONTACT_EMAIL_TO` and `CONTACT_EMAIL_FROM` (a verified sender domain).
Without a key, the form shows the phone number, WhatsApp and e-mail address instead.

### Prismic setup

- **Previews**: in Prismic → Settings → Previews, add `https://<your-domain>/api/preview`.
- **Publishing**: add a webhook on "document published" to `https://<your-domain>/api/revalidate`.
- **Types**: after changing models in Slice Machine, run `npm run types`.

## Design

Typography: Archivo (variable width) for display and text, JetBrains Mono for labels and specs.
Palette: graphite and warm off-white, with the champagne gold of the BVB monogram as accent.
Colors and components are defined in `src/app/globals.css`.
