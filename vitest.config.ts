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
  // q-mp-1187: shard monolith for unit-isolated parallel wall trim.
  'tests/unit/existing-games-controllers*.test.ts',
  'tests/unit/existing-games-tutorials.test.ts',
  // MP-3D suites mock feature-flags / three.js and must not leak into 2D controller tests.
  'tests/unit/mp3d-*.test.ts',
  // q-mp-594: hex-a-gone-board-3d soft-fail — doMock load-three + installThreeMock.
  'tests/unit/q-mp-594-hex-a-gone-board-3d-soft-fail-residuals.test.ts',
  // q-mp-616: star-track-board-3d branch residuals — doMock load-three / tablet-gl.
  'tests/unit/q-mp-616-star-track-board-3d-branch-residuals.test.ts',
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
  // q-mp-420: storage soft-fail residuals — resetModules + doMock load() catch.
  'tests/unit/q-mp-420-storage-soft-fail-residuals.test.ts',
  // Hoisted game-controller mocks must not leak into shared controller suites.
  'tests/unit/burn-1007-game-route-mounts.test.ts',
  'tests/unit/burn-1007-main-shell-routes.test.ts',
  // q-mp-353: game-route-mounts soft-fail matrix — same hoisted controller mocks.
  'tests/unit/q-mp-353-game-route-mounts-soft-fail.test.ts',
  // mutation-ui19 + q-mp-549: same hoisted controller mocks (were shared-pool).
  'tests/unit/mutation-ui19-game-route-mounts.test.ts',
  'tests/unit/q-mp-549-game-route-mounts-soft-fail-residuals.test.ts',
  // q-mp-677: residual branch matrix — same hoisted controller mocks.
  'tests/unit/q-mp-677-game-route-mounts-residual-branches.test.ts',
  // q-mp-299: main.ts soft-fail characterization — same hoisted PWA/demo mocks.
  'tests/unit/q-mp-299-main-soft-fail.test.ts',
  // q-mp-685 / q-mp-1212: main.ts residual shards — same hoisted PWA/demo mocks.
  'tests/unit/q-mp-685-main-residual-branches*.test.ts',
  // q-mp-422: router soft-fail matrix — vi.resetModules for module-default 404.
  'tests/unit/q-mp-422-router-soft-fail.test.ts',
  // q-mp-453: game-prefetch soft-fail residuals — resetModules + doMock loaders.
  'tests/unit/q-mp-453-game-prefetch-soft-fail-residuals.test.ts',
  // q-mp-653: game-prefetch residual branches — resetModules + doMock loaders.
  'tests/unit/q-mp-653-game-prefetch-residuals.test.ts',
  // Real controller imports + destroyGame mutates module singletons.
  // q-mp-1188: shards share isolate (real controller imports + destroyGame).
  'tests/unit/burn-1008-registry-module-contract*.test.ts',
  // q-mp-117: generation-gated timeout characterization — fake timers +
  // isolate so shared-graph timer pollution cannot starve awaits (CI flake).
  'tests/unit/ui-helper-dedupe-characterization.test.ts',
  // Hoisted game-registry mock injects unavailable card for selector coverage.
  'tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts',
  // q-mp-454: game-selector soft-fail residuals — registry + prefetch mocks.
  'tests/unit/q-mp-454-game-selector-soft-fail-residuals.test.ts',
  // q-mp-654: game-selector residual branches — empty DIVISIONS mock.
  'tests/unit/q-mp-654-game-selector-residual-branches.test.ts',
  // q-mp-472: game-registry soft-fail residuals — temporary available flips.
  'tests/unit/q-mp-472-game-registry-soft-fail-residuals.test.ts',
  // q-mp-506: engine r17 graph defensive spies — Array/Map/String/Array.from
  // prototype patches must not leak into isolate:false shared workers.
  'tests/unit/engine-coverage-round-17-graph-defensive-spies.test.ts',
  // q-mp-678: expression-demo residual branches — hoisted expression-ui wrap
  // must not leak createInteractiveBuilder into shared isolate:false suites.
  'tests/unit/q-mp-678-expression-demo-residual-branches.test.ts',
  // q-mp-666: kings/board residual branches — Array.from spy for sparse start rows.
  'tests/unit/q-mp-666-kings-board-residual-branches.test.ts',
  // q-mp-680: attribute-demo residual branches — hoisted router.navigate mock
  // + Math.floor NaN spy must not share isolate:false graph with restoreAllMocks.
  'tests/unit/q-mp-680-attribute-demo-residual-branches.test.ts',
  // q-mp-697: fiar/layout residual arms — Set.prototype add/has spies must not
  // leak into isolate:false shared workers.
  'tests/unit/q-mp-697-fiar-layout-residuals.test.ts',
  // q-mp-703: prime-gold/types L145 — Array.prototype.filter → Proxy hole.
  'tests/unit/q-mp-703-prime-gold-types-residuals.test.ts',
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
  // q-mp-1108: parallel shards (queens seeds + other games) — keep on unit-node.
  'tests/unit/state-roundtrip-fuzz-queens-a.test.ts',
  'tests/unit/state-roundtrip-fuzz-queens-b.test.ts',
  'tests/unit/state-roundtrip-fuzz-games.test.ts',
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
  // mobile-audit --out parser (q-mp-844); spawnSync CLI check needs node env.
  'tests/unit/mobile-audit-out-path.test.ts',
  // check-copy-pins + report-knip unknown-flag argv (q-mp-873); spawnSync needs node.
  'tests/unit/check-copy-pins-report-knip-args.test.ts',
  // report-lint-buckets --top/--rule argv (q-mp-870); spawnSync CLI check needs node env.
  'tests/unit/report-lint-buckets-parse-args.test.ts',
  // offline probe early --help (q-mp-886); spawnSync CLI check needs node env.
  'tests/unit/offline-probe-cli-help.test.ts',
  // deep-playtest early --help (q-mp-910); spawnSync CLI check needs node env.
  'tests/unit/deep-playtest-cli-help.test.ts',
  // deep-playtest page-ready adoption (q-mp-925); spawnSync + source asserts need node.
  'tests/unit/deep-playtest-page-ready.test.ts',
  // deep-playtest end word-boundaries + PAR55_QUICK (q-mp-1259 / 1260); hermetic node.
  'tests/unit/q-mp-1259-1260-deep-playtest-end.test.ts',
  // help-only CLI argv (q-mp-885); spawnSync CLI check needs node env.
  'tests/unit/help-only-cli.test.ts',
  // report-licenses --dry-run write guard (q-mp-979); spawnSync CLI check needs node env.
  'tests/unit/report-licenses-cli-args.test.ts',
  // harness env Number() parser (q-mp-876 / q-mp-908); spawnSync CLI check needs node env.
  'tests/unit/env-number.test.ts',
  // writable artifact-dir helper (q-mp-955); injectable mkdirSync needs node env.
  'tests/unit/artifact-dir.test.ts',
  // mutation-report argv validation (q-mp-867 / q-mp-868); spawnSync CLI check.
  'tests/unit/mutation-report-args.test.ts',
  // mutation-report Vitest status classify (q-mp-1038); hermetic node env.
  'tests/unit/mutation-report-vitest-status.test.ts',
  // report-coverage-map flag-like argv rejection (q-mp-906); spawnSync CLI check.
  'tests/unit/report-coverage-map-cli-args.test.ts',
  // browser harness early --help (q-mp-900); spawnSync CLI check needs node env.
  'tests/unit/browser-harness-cli-help.test.ts',
  // render-perf-mode main-entry usage / --help (q-mp-919); spawnSync CLI check.
  'tests/unit/render-perf-mode-cli-help.test.ts',
  // check:perf early --help / unknown flags (q-mp-917); spawnSync CLI check needs node env.
  'tests/unit/check-perf-cli-args.test.ts',
  // check:perf LH timeout child kill (q-mp-1090); hermetic mock child needs node env.
  'tests/unit/check-perf-lh-timeout-kill.test.ts',
  // check:perf missing LH performance score fail-closed (q-mp-1208); fixture JSON.
  'tests/unit/check-perf-missing-score.test.ts',
  // check:perf out-of-range LH performance score fail-closed (q-mp-1246); fixture JSON.
  'tests/unit/check-perf-out-of-range-score.test.ts',
  // page-settle double-rAF helper (q-mp-920); hermetic fake page.evaluate needs node.
  'tests/unit/page-settle.test.ts',
  // memory-leak-audit page-ready adoption (q-mp-923); spawnSync --check/--help.
  'tests/unit/memory-leak-page-ready.test.ts',
  // memory-leak heap snapshot / null deltas (q-mp-1215 / 1216); hermetic fixtures.
  'tests/unit/memory-leak-heap-snapshot.test.ts',
  // runtime-perf helpers: PERF_DATE H1 / clickFirst / empty LT max (q-mp-1239/1244/1245).
  'tests/unit/runtime-perf-helpers.test.ts',
  // lib main-entry usage / --help (q-mp-958); spawnSync CLI check needs node env.
  'tests/unit/lib-main-entry-cli-help.test.ts',
  // render-perf-mode measureTTI page-ready adoption (q-mp-948); fake page / node.
  'tests/unit/render-perf-mode-measure-tti.test.ts',
  // render-perf-mode summarizeSamples invalid durationMs filter (q-mp-1224).
  'tests/unit/render-perf-mode-duration-ms.test.ts',
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
