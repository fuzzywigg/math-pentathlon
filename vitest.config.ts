import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

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
  // Golden save fixtures + migrateProgressData remount path (burn-1008).
  'tests/unit/storage-save-migration-fixtures.test.ts',
  // Remounts StorageManager with blocked localStorage (burn-1008 storage failure).
  'tests/unit/safe-web-storage-remount.test.ts',
  // Hoisted game-controller mocks must not leak into shared controller suites.
  'tests/unit/burn-1007-game-route-mounts.test.ts',
  'tests/unit/burn-1007-main-shell-routes.test.ts',
  // Real controller imports + destroyGame mutates module singletons.
  'tests/unit/burn-1008-registry-module-contract.test.ts',
  // Generation-gated timeout characterization — fake timers + isolate so
  // shared-graph timer pollution cannot starve real-timer awaits (CI flake).
  'tests/unit/ui-helper-dedupe-characterization.test.ts',
  // Hoisted game-registry mock injects unavailable card for selector coverage.
  'tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts',
];

/** vite-plugin-pwa virtual module is build-only; stub for unit tests. */
const pwaRegisterAlias = {
  'virtual:pwa-register': path.join(
    rootDir,
    'tests/unit/mocks/virtual-pwa-register.ts'
  ),
};

/**
 * Curated pure AI / rules leftovers that never touch the DOM.
 * Run under `node` to skip jsdom environment cost. Keep this list conservative:
 * owl/storage suites need extra browser APIs beyond localStorage polyfill.
 */
const nodePureFiles = [
  'tests/unit/ai-determinism-shard-a.test.ts',
  'tests/unit/ai-determinism-shard-b.test.ts',
  'tests/unit/ai-determinism-shard-c.test.ts',
  'tests/unit/ai-determinism-shard-d.test.ts',
  'tests/unit/ai-determinism-shard-e.test.ts',
  'tests/unit/ai-calibration-difficulty-order.test.ts',
  'tests/unit/state-roundtrip-fuzz.test.ts',
  'tests/unit/engine-property-invariants.test.ts',
  'tests/unit/ai-worker-parity-fab.test.ts',
  'tests/unit/ai-worker-parity-queens-hex.test.ts',
  'tests/unit/ai-worker-parity-fiar.test.ts',
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
  'tests/unit/burn-wave13-win-draw-ai.test.ts',
  // Rules engines must load without jsdom (module-boundary audit).
  'tests/unit/engines-plain-node-load.test.ts',
  // Engine→UI seat helper characterization + auditBoundaries ratchet.
  'tests/unit/engine-ui-boundary-seats-characterization.test.ts',
  // Emit-identity checker imports esbuild (needs Node TextEncoder, not jsdom).
  'tests/unit/check-emit-identity.test.ts',
  // Ratchet-history reporter is a Node script (no DOM / jsdom setup).
  'tests/unit/report-ratchet-history.test.ts',
];

// Prefer Vitest's auto worker count (uses available CPUs; CI-aware). Optional
// override via VITEST_MAX_WORKERS for local experiments / constrained runners.
const maxWorkers = process.env.VITEST_MAX_WORKERS
  ? Number(process.env.VITEST_MAX_WORKERS)
  : undefined;

export default defineConfig({
  test: {
    coverage,
    // stack: file afterEach runs before setupFiles afterEach, so shared cleanup
    // is the last safety net for timers / stubs under isolate:false shuffle.
    sequence: { hooks: 'stack' },
    ...(maxWorkers && Number.isFinite(maxWorkers) && maxWorkers > 0
      ? { maxWorkers }
      : {}),
    projects: [
      {
        resolve: { alias: pwaRegisterAlias },
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
        resolve: { alias: pwaRegisterAlias },
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
        resolve: { alias: pwaRegisterAlias },
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
