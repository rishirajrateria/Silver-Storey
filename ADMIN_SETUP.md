# Silver Storey CMS — setup

The website now runs on its own content manager at **`/admin`**, backed by your
own Postgres database and Vercel Blob storage. Sanity is no longer used.

---

## 1. Create the database

On Vercel: **Storage → Create → Postgres** (Neon). Connecting it to the project
sets `DATABASE_URL` automatically. Any Postgres works — Neon, Supabase, Railway
or your own server.

Copy the connection strings into `.env.local` for local development:

```bash
DATABASE_URL="postgres://user:pass@host/db?sslmode=require"
```

Create the tables:

```bash
npx prisma migrate dev --name init      # local, creates the migration
npx prisma migrate deploy               # production / CI
```

If your provider gives a _pooled_ connection string (Neon, Supabase pgBouncer),
run migrations against the **direct** one — pooled connections cannot run DDL:

```bash
DATABASE_URL="postgres://…direct…" npx prisma migrate deploy
```

## 2. Create the admin login

```bash
node scripts/hash-password.mjs "a-long-password-you-choose"
```

It prints three values. Put them in `.env.local` **and** in
Vercel → Settings → Environment Variables:

```bash
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD_HASH="$2b$12$..."     # never store the plain password
ADMIN_SESSION_SECRET="..."           # random, at least 32 characters
```

The password itself is never stored — only its bcrypt hash. To change it, re-run
the script and replace the hash.

## 3. Enable image uploads

On Vercel: **Storage → Create → Blob**. Connecting it sets
`BLOB_READ_WRITE_TOKEN` automatically.

```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

Without this token, uploads are written to `public/uploads` instead — fine for
local development, but **not** on Vercel, where the filesystem is ephemeral and
uploads would disappear on the next deploy.

### About uploaded images

Uploads are resized to a maximum of 2000px on the longest side and converted to
WebP before being stored — the equivalent of the on-the-fly resizing Sanity's
CDN used to do. A 9 MB phone photo lands at roughly 1.4 MB. Images already
smaller than the re-encoded version are stored untouched.

## 4. (Optional) Import your existing Sanity content

Run once, from a machine that can reach the Sanity API:

```bash
# See what would be imported, without writing anything:
SANITY_PROJECT_ID=kae503a3 SANITY_DATASET=production \
DATABASE_URL="postgres://…" \
node scripts/migrate-from-sanity.mjs --dry-run

# Then, for real — including copying images into Blob storage:
SANITY_PROJECT_ID=kae503a3 SANITY_DATASET=production \
DATABASE_URL="postgres://…" BLOB_READ_WRITE_TOKEN="vercel_blob_rw_…" \
node scripts/migrate-from-sanity.mjs
```

It imports categories, videos, project pages (with all gallery sections and
images), blog posts and the brochure. Portable Text bodies are converted to
Markdown. Re-running is safe — existing rows are matched on slug and updated.

If you skip `BLOB_READ_WRITE_TOKEN`, images keep their Sanity CDN URLs: the site
works, but images are still hosted by Sanity. Supply the token to become fully
independent.

## 5. Sign in

Visit `/admin`. You will be redirected to the login page.

---

## The dashboard

`/admin` opens on an analytics overview covering the last 7, 30 or 90 days:

| Panel                        | What it tells you                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **KPI row**                  | Visitors, page views, enquiries and enquiry rate, each against the previous period                                |
| **Visitors and page views**  | Daily trend, with a hover readout and a table view                                                                |
| **Top pages**                | Which pages people actually land on — the clearest read on whether the city and service pages are earning traffic |
| **Where visitors come from** | Search engines, direct, other websites, social. Search climbing here is the SEO signal                            |
| **Devices / Countries**      | Mobile share, and NRI demand from the Gulf, UK and US                                                             |
| **Latest enquiries**         | The most recent contact-form submissions                                                                          |
| **Content**                  | The CMS sections, with current counts                                                                             |

### How the analytics work

Tracking is first-party: a small script posts the path and referring hostname
to `/api/track` on your own domain. Specifically:

- **No cookies and no local storage**, so no consent banner is required for it.
- **No personal data is stored.** Unique visitors are counted with
  `sha256(daily salt + IP + user agent)`, truncated. The IP and user agent are
  never written down, and because the salt rotates at midnight UTC the same
  person tomorrow is a different, unlinkable hash.
- **Only the referring hostname** is kept (`google.com`), never the full URL —
  so search queries never land in your database.
- **Bots are filtered** before insert, including Googlebot, GPTBot, ClaudeBot,
  PerplexityBot and monitoring tools, so numbers reflect people.
- **Admin pages are never tracked.**

Set `ANALYTICS_SALT` to a random string if you want the visitor hash salt
independent of `ADMIN_SESSION_SECRET` (it falls back to that otherwise).

### Enquiries

Every contact-form submission is written to the database _before_ the
notification email is sent, so a failed email can no longer lose a lead. Each
enquiry records the page it came from and carries a status you can move through
new → contacted → qualified → won / lost on `/admin/leads`.

## What you can edit

| Section             | Controls                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Categories**      | The room cards on the home page — name, starting price, image, order                                                                                                        |
| **Videos**          | The home page YouTube carousel — paste any YouTube URL                                                                                                                      |
| **Project Pages**   | Gallery pages, with drag-free ordering of sections and images                                                                                                               |
| **Blog**            | Articles in Markdown, with live preview, excerpt, cover image and category                                                                                                  |
| **Brochure**        | The downloadable PDF on the home page                                                                                                                                       |
| **Testimonials**    | Real client reviews; published ones replace the built-in quotes on the home and about pages and feed Review/AggregateRating markup — only add reviews clients actually gave |
| **Lookbooks**       | PDF catalogues at `/lookbooks`; visitors leave name, phone and email to unlock the download (saved as a "lookbook" enquiry)                                                 |
| **Client Projects** | Progress tracker at `/track`. Create a project, share the generated `SS-XXXXXX` code, post updates with site photos; the client logs in with the code + last 4 phone digits |

Project Pages can also be full **case studies**: open "Case study details" on any page to add location, area, budget, duration, the story (Markdown), materials, a before/after photo pair (drag slider on the site) and a client quote. Tag gallery images with a room type to get room filter chips on the page. The reserved slug `3d-visualisation` feeds the `/3d-visualisation` showcase.

Enquiries now come from three places: the contact form, the cost calculator at `/estimate` (which saves the visitor's inputs and ₹ range) and lookbook downloads.

### Reserved project slugs

Two slugs power the existing top-level pages rather than `/projects/…`:

- `residential-projects` → `/residential-projects`
- `commercial-projects` → `/commercial-projects`

Create a project page with one of those slugs to control those pages. Any other
slug becomes `/projects/<slug>` and is added to the site menu automatically.

### Blog: CMS posts and built-in guides

The site ships with 15 long-form SEO guides written in code
(`src/lib/blog/articles/`). Posts you write in the admin panel appear alongside
them. If a CMS post uses the same slug as a built-in guide, the CMS post wins —
that is how you override a built-in article.

---

## Environment variables reference

| Variable                            | Required    | Purpose                                                                                                             |
| ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                      | yes         | Postgres connection string                                                                                          |
| `DIRECT_DATABASE_URL`               | no          | Non-pooled connection, used by migrations                                                                           |
| `ADMIN_EMAIL`                       | yes         | The login email                                                                                                     |
| `ADMIN_PASSWORD_HASH`               | yes         | bcrypt hash from `scripts/hash-password.mjs`                                                                        |
| `ADMIN_SESSION_SECRET`              | yes         | Random string, 32+ characters, signs session cookies                                                                |
| `BLOB_READ_WRITE_TOKEN`             | on Vercel   | Vercel Blob storage for uploads                                                                                     |
| `NEXT_PUBLIC_SITE_URL`              | recommended | Canonical URLs, sitemaps, OG tags                                                                                   |
| `REVALIDATE_SECRET`                 | no          | Lets scripts call `/api/revalidate?secret=…`                                                                        |
| `SMTP_USER` / `SMTP_PASS`           | existing    | Contact form and estimate emails                                                                                    |
| `CONTACT_TO_EMAIL`                  | recommended | Where enquiry emails go (defaults to care@silverstorey.com)                                                         |
| `NEXT_PUBLIC_SOCIAL_INSTAGRAM` etc. | recommended | Social profile URLs (`_FACEBOOK`, `_LINKEDIN`, `_YOUTUBE`, `_PINTEREST`). Icons only render for networks with a URL |

## Security notes

- `/admin` is protected by `src/proxy.ts` (Next.js 16 replaced `middleware.ts`
  with `proxy.ts`) and re-checked in every admin page.
- Sessions are signed JWTs in an `httpOnly`, `sameSite=lax` cookie, valid 8 hours.
- Login is rate limited to 8 attempts per 15 minutes per IP.
- Blog bodies are parsed to React elements, never injected as HTML, so editor
  content cannot introduce scripts.
- `/admin` is marked `noindex` and excluded from sitemaps.

## Troubleshooting

**"No database connected" on the dashboard** — `DATABASE_URL` is missing or
unreachable. The public site still renders, using its built-in fallback content.

**Uploads vanish after deploying** — `BLOB_READ_WRITE_TOKEN` is not set, so files
went to the ephemeral filesystem. Add a Blob store and re-upload.

**Changes do not appear on the site** — pages are cached for 60 seconds; saving
in the admin panel revalidates affected pages immediately. If something is
stale, `POST /api/revalidate?path=/the/path` while signed in.
