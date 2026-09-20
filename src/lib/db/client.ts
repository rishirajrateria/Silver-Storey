import { PrismaClient } from '@prisma/client';

/**
 * Prisma singleton. Next.js hot-reloads modules in dev, which would otherwise
 * open a new connection pool on every reload and exhaust the database.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/** True when a database connection string is configured. */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

/**
 * Runs a database read, falling back to `fallback` if the database is not
 * configured or the query fails.
 *
 * Public pages use this so the site still builds and renders (with empty
 * content) before the database is provisioned — the same defensive posture the
 * previous CMS integration used.
 */
export async function safeQuery<T>(
  run: () => Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  if (!isDatabaseConfigured) return fallback;
  try {
    return await run();
  } catch (error) {
    console.error(`[db] ${label} failed:`, error);
    return fallback;
  }
}
