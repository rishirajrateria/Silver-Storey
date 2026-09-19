import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // `server-only` throws when imported outside a server component bundle.
      // Tests run in plain Node, so stub it out.
      'server-only': path.resolve(
        __dirname,
        'src/__tests__/stubs/server-only.ts',
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
