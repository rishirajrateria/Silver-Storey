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

## What you can edit

| Section           | Controls                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| **Categories**    | The room cards on the home page — name, starting price, image, order       |
| **Videos**        | The home page YouTube carousel — paste any YouTube URL                     |
| **Project Pages** | Gallery pages, with drag-free ordering of sections and images              |
| **Blog**          | Articles in Markdown, with live preview, excerpt, cover image and category |
| **Brochure**      | The downloadable PDF on the home page                                      |

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

| Variable                  | Required    | Purpose                                              |
| ------------------------- | ----------- | ---------------------------------------------------- |
| `DATABASE_URL`            | yes         | Postgres connection string                           |
| `DIRECT_DATABASE_URL`     | no          | Non-pooled connection, used by migrations            |
| `ADMIN_EMAIL`             | yes         | The login email                                      |
| `ADMIN_PASSWORD_HASH`     | yes         | bcrypt hash from `scripts/hash-password.mjs`         |
| `ADMIN_SESSION_SECRET`    | yes         | Random string, 32+ characters, signs session cookies |
| `BLOB_READ_WRITE_TOKEN`   | on Vercel   | Vercel Blob storage for uploads                      |
| `NEXT_PUBLIC_SITE_URL`    | recommended | Canonical URLs, sitemaps, OG tags                    |
| `REVALIDATE_SECRET`       | no          | Lets scripts call `/api/revalidate?secret=…`         |
| `SMTP_USER` / `SMTP_PASS` | existing    | Contact form email (unchanged)                       |

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
