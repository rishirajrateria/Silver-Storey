#!/usr/bin/env node
/**
 * Runs at the start of every build, before `next build`.
 *
 * With no DATABASE_URL the site still builds — pages fall back to empty
 * content, which is what happens before the database is provisioned. Once
 * DATABASE_URL is set, this applies any pending migrations and, on a brand
 * new database only, seeds the home page room cards so the first deploy comes
 * up with content instead of a collapsed marquee.
 *
 * Migrations need a direct (non-pooled) connection: pooled endpoints such as
 * Neon's or Supabase's pgBouncer cannot run DDL. DIRECT_DATABASE_URL is used
 * for the migration step when set, otherwise DATABASE_URL.
 */
import { execFileSync } from 'node:child_process';

const { DATABASE_URL, DIRECT_DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.log(
    '[db] DATABASE_URL is not set — skipping migrations. The site will build and render with empty content.',
  );
  process.exit(0);
}

const migrationUrl = DIRECT_DATABASE_URL || DATABASE_URL;
if (DIRECT_DATABASE_URL) {
  console.log('[db] using DIRECT_DATABASE_URL for migrations');
}

console.log('[db] applying migrations…');
execFileSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: migrationUrl },
});

/*
 * Seed only a genuinely empty table. Anything you have added or edited in the
 * admin panel is therefore never overwritten by a later deploy — including a
 * deliberately emptied category list, which stays empty after the first seed
 * because deleting all six is itself an edit you would have to make.
 */
const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

try {
  const existing = await prisma.category.count();

  if (existing > 0) {
    console.log(`[db] ${existing} categories already present — not seeding.`);
  } else {
    console.log('[db] empty database — seeding the home page room cards…');
    await prisma.category.createMany({
      data: [
        { name: 'Bedroom', price: '2.1 L', order: 0 },
        { name: 'Dining', price: '1 L', order: 1 },
        { name: 'Kitchen', price: '1.4 L', order: 2 },
        { name: 'Bathroom', price: '1.8 L', order: 3 },
        { name: 'Living Room', price: '2.4 L', order: 4 },
        { name: 'Office', price: '2 L', order: 5 },
      ],
    });
    console.log(
      '[db] seeded 6 categories. Add their images in /admin → Categories.',
    );
  }
} finally {
  await prisma.$disconnect();
}
