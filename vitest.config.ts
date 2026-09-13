import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
    // Coverage instrumentation slows heavy AI suites (e.g. Fab hard search)
    testTimeout:
      process.env.CI || process.argv.includes('--coverage') ? 15_000 : 5_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
