#!/usr/bin/env node
/**
 * Generates the env values needed by the admin panel.
 *
 *   node scripts/hash-password.mjs "your-password"
 *
 * Prints ADMIN_PASSWORD_HASH and a fresh ADMIN_SESSION_SECRET.
 */
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Please choose a password of at least 10 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const secret = randomBytes(32).toString('base64');

console.log(
  '\nAdd these to your .env.local (and to Vercel → Settings → Environment Variables):\n',
);
console.log(`ADMIN_EMAIL="you@example.com"`);
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log(`ADMIN_SESSION_SECRET="${secret}"`);
console.log('\nKeep these secret. Re-run this script to rotate them.\n');
