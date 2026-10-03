import { defineConfig } from 'vitest/config';

const coverage = {
  provider: 'v8' as const,
  reporter: ['text', 'json', 'json-summary', 'html'],
  reportOnFailure: true,
  include: ['src/**/*.{js,ts}'],
  exclude: ['src/**/*.d.ts'],
};

/** Handwritten tests that need a fresh module graph (vi.mock / controller singletons). */
const isolatedFiles = [
  'tests/unit/stats-dashboard.test.ts',
  'tests/unit/existing-games-controllers.test.ts',
  'tests/unit/existing-games-tutorials.test.ts',
];

export default defineConfig({
  test: {
    coverage,
    projects: [
      {
        test: {
          name: 'unit-shared',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['tests/unit/setup.ts'],
          pool: 'threads',
          isolate: false,
          testTimeout: 30_000,
          hookTimeout: 30_000,
          include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            'tests/unit/_tokenmaxx_archive/**',
            'tests/unit-archive/**',
            'tests/unit/setup.ts',
            ...isolatedFiles,
          ],
        },
      },
      {
        test: {
          name: 'unit-isolated',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['tests/unit/setup.ts'],
          pool: 'threads',
          isolate: true,
          testTimeout: 30_000,
          hookTimeout: 30_000,
          include: isolatedFiles,
        },
      },
    ],
  },
});
