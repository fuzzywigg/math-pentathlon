/**
 * q-mp-653 — Close `game-prefetch` residual branches under the *game-prefetch*
 * verify glob (tests-only; 0 src; mock loaders — no network).
 *
 * Tip re-measure (`cursor/mp-tip-post1023` @ `1cfbd394`):
 * - Spec glob `tests/unit/*game-prefetch*` (game-prefetch + mutation-ui2 +
 *   q-mp-453): **72.22%** lines / **86.48%** branches.
 * - Backlog “48.6%” matches basic hosts only (game-prefetch + mutation-ui2).
 * - burn-1008-ui-cov-r2-prefetch already closes loader bodies but does **not**
 *   match `*game-prefetch*` — same gap pattern as q-mp-631 / idle-warm.
 *
 * Residual clusters closed here under the verify glob:
 * - Loader arrow bodies (~11–31) via development-MODE mocked imports
 * - No-window idle sync `run()` (~142 / 151–156)
 * - Reset with window undefined while an idle handle is pending (~61)
 *
 * Unreachable via public API (characterize only; no src edit):
 * - L52 `allowPrefetchImportsForTests` true arm (setter only called with false)
 * - L110 defensive `!load` after `Object.hasOwn(loaders, gameId)`
 *
 * Leave #921 / #927 (q-mp-453 soft-fail char) open with `contained`.
 *
 * Listed in `vitest.config.ts` `isolatedFiles` so `vi.resetModules()` +
 * game-controller `doMock` cannot leak into unit-shared controller suites.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const PREFETCH_SRC = readFileSync(
  resolve(process.cwd(), 'src/ui/game-prefetch.ts'),
  'utf8'
);

const GAME_IDS = [
  'kings-quadraphages',
  'hex',
  'star-track',
  'hex-a-gone',
  'calla',
  'fiar',
  'queens-guards',
  'contig-60',
  'juggle',
  'fab-a-diffy',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'prime-gold',
  'pent-em-in',
  'frac-fact',
  'remainder-islands',
  'fraction-pinball',
  'stars-bars',
] as const;

type PrefetchModule = typeof import('../../src/ui/game-prefetch');

async function loadPrefetch(
  options: { failIds?: ReadonlySet<string> } = {}
): Promise<PrefetchModule> {
  vi.resetModules();
  vi.stubEnv('MODE', 'development');
  const failIds = options.failIds ?? new Set<string>();
  for (const id of GAME_IDS) {
    if (failIds.has(id)) {
      vi.doMock(`../../src/games/${id}/game-controller`, () => {
        throw new Error(`prefetch-fail:${id}`);
      });
    } else {
      vi.doMock(`../../src/games/${id}/game-controller`, () => ({
        default: { id },
      }));
    }
  }
  const mod = await import('../../src/ui/game-prefetch');
  mod.resetGamePrefetchForTests();
  return mod;
}

function clearNavigatorConnection(): void {
  try {
    delete (navigator as Navigator & { connection?: unknown }).connection;
  } catch {
    /* ignore */
  }
}

describe('q-mp-653 game-prefetch — loader bodies under *game-prefetch* glob', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.restoreAllMocks();
    vi.useRealTimers();
    clearNavigatorConnection();
  });

  it('executes every registered loader under development MODE (no network)', async () => {
    // Closes ~11–31 / function coverage that burn-1008 owns outside this glob.
    const mod = await loadPrefetch();
    for (const id of GAME_IDS) {
      mod.prefetchGameChunk(id);
      expect(mod.isGamePrefetchStarted(id)).toBe(true);
    }
    await Promise.resolve();
    await Promise.resolve();
    for (const id of GAME_IDS) {
      expect(mod.isGamePrefetchStarted(id)).toBe(true);
    }
    mod.resetGamePrefetchForTests();
  });

  it('import failure still clears started (retry soft path under verify glob)', async () => {
    const mod = await loadPrefetch({ failIds: new Set(['hex']) });
    mod.prefetchGameChunk('hex');
    expect(mod.isGamePrefetchStarted('hex')).toBe(true);
    await vi.waitFor(() => {
      expect(mod.isGamePrefetchStarted('hex')).toBe(false);
    });
    mod.resetGamePrefetchForTests();
  });
});

describe('q-mp-653 game-prefetch — no-window idle / reset residuals', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.restoreAllMocks();
    vi.useRealTimers();
    clearNavigatorConnection();
    try {
      delete (window as Window & { requestIdleCallback?: unknown })
        .requestIdleCallback;
    } catch {
      /* ignore */
    }
    try {
      delete (window as Window & { cancelIdleCallback?: unknown })
        .cancelIdleCallback;
    } catch {
      /* ignore */
    }
  });

  it('idle with window undefined sync-runs queue (L142 / L151–156)', async () => {
    const mod = await loadPrefetch();
    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      expect(typeof (globalThis as { window?: unknown }).window).toBe(
        'undefined'
      );
      mod.prefetchGameChunksIdle(['hex', 'calla', 'bogus'], { max: 2 });
      expect(mod.isGamePrefetchStarted('hex')).toBe(true);
      expect(mod.isGamePrefetchStarted('calla')).toBe(true);
      expect(mod.isGamePrefetchStarted('bogus')).toBe(false);
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
      mod.resetGamePrefetchForTests();
    }
  });

  it('reset with window undefined clears pending idleHandle (L61 SSR arm)', async () => {
    vi.useFakeTimers();
    const ric = vi.fn((_cb: IdleRequestCallback) => 91);
    vi.stubGlobal('requestIdleCallback', ric);

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['hex'], { max: 1 });
    expect(ric).toHaveBeenCalledTimes(1);
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);

    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      expect(() => mod.resetGamePrefetchForTests()).not.toThrow();
      expect(mod.isGamePrefetchStarted('hex')).toBe(false);
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
    }
  });
});

describe('q-mp-653 game-prefetch — unreachable arms (structural only)', () => {
  it('keeps allowPrefetchImportsForTests true arm (L51–52; setter only false)', () => {
    // Public reset always calls allowGamePrefetchImportsForTests(false).
    // The true arm is unreachable without a src seam; pin presence only.
    expect(PREFETCH_SRC).toMatch(
      /if\s*\(\s*allowPrefetchImportsForTests\s*\)\s*\{\s*return true;/
    );
    expect(PREFETCH_SRC).toMatch(
      /allowGamePrefetchImportsForTests\(\s*false\s*\)/
    );
  });

  it('keeps defensive !load early-return after Object.hasOwn gate (L109–110)', () => {
    expect(PREFETCH_SRC).toMatch(
      /Object\.hasOwn\(\s*loaders\s*,\s*gameId\s*\)/
    );
    expect(PREFETCH_SRC).toMatch(
      /const load = loaders\[gameId\];\s*if\s*\(\s*!load\s*\)\s*\{\s*return;/
    );
  });
});
