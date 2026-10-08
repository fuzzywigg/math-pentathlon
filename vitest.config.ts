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
  'tests/unit/keyboard-a11y-game-selector.test.ts',
  // Module-level bench accumulator + summarize it() is order-dependent under
  // --sequence.shuffle; isolate + afterAll summary keeps it deterministic.
  'tests/unit/tablet-ai-hard-latency.bench.test.ts',
  // Re-imports StorageManager via vi.resetModules to exercise constructor load().
  'tests/unit/durable-progress-persistence.test.ts',
];

/**
 * Pure AI / rules leftovers that never touch the DOM. Run under `node` to skip
 * jsdom environment cost (largest cumulative Vitest timer on this suite).
 */
const nodePureFiles = [
  'tests/unit/ai-worker-parity-fab.test.ts',
  'tests/unit/ai-worker-parity-queens-hex.test.ts',
  'tests/unit/burn-wave41-fab-ai-execute-steps.test.ts',
  'tests/unit/burn-wave43-fab-ai-execute-difficulties.test.ts',
  'tests/unit/overnight-fab-ai-difficulties-gates.test.ts',
  'tests/unit/overnight-wave54-fab-ai-hard-randomness.test.ts',
  'tests/unit/burn-wave44-fab-ai-medium-random-top3.test.ts',
  'tests/unit/overnight-fab-ai-randomness-medium.test.ts',
  'tests/unit/burn-wave44-fab-ai-easy-teaching-branch.test.ts',
  'tests/unit/overnight-wave55-fab-ai-short-pool-null.test.ts',
  'tests/unit/queens-hex-ai-play-deadline.test.ts',
  'tests/unit/fab-a-diffy-ai-play-deadline.test.ts',
  'tests/unit/burn-wave12-win-draw-ai.test.ts',
  'tests/unit/burn-wave16-ai-pipeline.test.ts',
  'tests/unit/burn-wave16-ai-null-gates.test.ts',
  'tests/unit/burn-wave16-ai-accuracy.test.ts',
  'tests/unit/burn-wave9-win-draw-ai.test.ts',
  'tests/unit/burn-wave11-win-draw-ai.test.ts',
  'tests/unit/burn-wave10-win-draw-ai.test.ts',
  'tests/unit/burn-wave7-win-draw-ai.test.ts',
  'tests/unit/burn-wave18-ai-midphase.test.ts',
  'tests/unit/burn-wave41-pent-ai-difficulties.test.ts',
  'tests/unit/burn-wave42-pent-ai-difficulty-random.test.ts',
];

// Cap workers: GHA ubuntu-latest is 2 vCPU; local cloud VMs vary. Explicit
// maxWorkers keeps pool scheduling predictable vs Vitest's auto heuristic.
const maxWorkers = process.env.CI ? 2 : Math.min(4, Math.max(1, (Number(process.env.VITEST_MAX_WORKERS) || 4)));

export default defineConfig({
  test: {
    coverage,
    // stack: file afterEach runs before setupFiles afterEach, so shared cleanup
    // is the last safety net for timers / stubs under isolate:false shuffle.
    sequence: { hooks: 'stack' },
    maxWorkers,
    projects: [
      {
        test: {
          name: 'unit-node',
          globals: true,
          environment: 'node',
          setupFiles: ['tests/unit/setup-node.ts'],
          pool: 'threads',
          isolate: false,
          testTimeout: 30_000,
          hookTimeout: 30_000,
          include: nodePureFiles,
        },
      },
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
            'tests/unit/setup-node.ts',
            'tests/unit/helpers/**',
            ...isolatedFiles,
            ...nodePureFiles,
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
