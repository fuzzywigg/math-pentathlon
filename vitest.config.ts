import { defineConfig } from 'vitest/config';

const coverage = {
  provider: 'v8' as const,
  reporter: ['text', 'json', 'json-summary', 'html'],
  reportOnFailure: true,
  include: ['src/**/*.{js,ts}'],
  exclude: ['src/**/*.d.ts'],
};

/** Tests that need a fresh module graph (vi.mock / controller singletons). */
const isolatedFiles = [
  'tests/unit/stats-dashboard.test.ts',
  'tests/unit/existing-games-controllers.test.ts',
  'tests/unit/existing-games-tutorials.test.ts',
  // MP-3D suites mock feature-flags / three.js and must not leak into 2D controller tests.
  'tests/unit/mp3d-*.test.ts',
  // Hoisted router.navigate mock must not share a graph with files that call
  // restoreAllMocks under isolate:false shuffle.
  'tests/unit/burn-wave24-stats-selector-ui.test.ts',
  // Module-level bench accumulator + summarize it() is order-dependent under
  // --sequence.shuffle; isolate + afterAll summary keeps it deterministic.
  'tests/unit/tablet-ai-hard-latency.bench.test.ts',
  // Re-imports StorageManager via vi.resetModules to exercise constructor load().
  'tests/unit/durable-progress-persistence.test.ts',
];

export default defineConfig({
  test: {
    coverage,
    // stack: file afterEach runs before setupFiles afterEach, so shared cleanup
    // is the last safety net for timers / stubs under isolate:false shuffle.
    sequence: { hooks: 'stack' },
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
