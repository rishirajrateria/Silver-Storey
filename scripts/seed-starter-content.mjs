#!/usr/bin/env node
/**
 * Seeds the room category cards that the home page marquee reads.
 *
 *   DATABASE_URL="postgres://…" node scripts/seed-starter-content.mjs
 *
 * These six names and prices are the ones the site shipped with before the
 * content moved into the CMS. They carry no images — add those in
 * /admin → Categories, where the upload puts them in Blob storage.
 *
 * Safe to re-run: a category is matched by name and updated rather than
 * duplicated, and a price you have since edited in the admin panel is left
 * alone. Only `--force` overwrites edited prices.
 */
import { PrismaClient } from '@prisma/client';

const CATEGORIES = [
  { name: 'Bedroom', price: '2.1 L', order: 0 },
  { name: 'Dining', price: '1 L', order: 1 },
  { name: 'Kitchen', price: '1.4 L', order: 2 },
  { name: 'Bathroom', price: '1.8 L', order: 3 },
  { name: 'Living Room', price: '2.4 L', order: 4 },
  { name: 'Office', price: '2 L', order: 5 },
];

const force = process.argv.includes('--force');

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Run:\n  DATABASE_URL="postgres://…" node scripts/seed-starter-content.mjs',
  );
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  for (const cat of CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name },
    });

    if (!existing) {
      await prisma.category.create({ data: { ...cat, published: true } });
      console.log(`created  ${cat.name} — ${cat.price}`);
      continue;
    }

    if (existing.price !== cat.price && !force) {
      console.log(
        `kept     ${cat.name} — ${existing.price} (already edited; --force to reset)`,
      );
      continue;
    }

    await prisma.category.update({
      where: { id: existing.id },
      data: { price: cat.price, order: cat.order },
    });
    console.log(`updated  ${cat.name} — ${cat.price}`);
  }

  const total = await prisma.category.count({ where: { published: true } });
  console.log(
    `\n${total} published categories. The home page marquee reads these.`,
  );
} finally {
  await prisma.$disconnect();
}
