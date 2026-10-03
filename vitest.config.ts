import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/unit/_tokenmaxx_archive/**',
      'tests/unit-archive/**',
      'tests/unit/setup.ts',
    ],
    setupFiles: ['tests/unit/setup.ts'],
    // After TOKENMAXX prune: threads + shared env cut jsdom setup cost.
    // setup.ts resets DOM/storage/owl library; demo/controller mutator
    // TOKENMAXX chrome tests that poison module singletons were removed.
    pool: 'threads',
    isolate: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportOnFailure: true,
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/**/*.d.ts'],
    },
  },
});
