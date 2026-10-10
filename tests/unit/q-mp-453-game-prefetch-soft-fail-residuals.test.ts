/**
 * q-mp-453 — Characterize `game-prefetch` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post898`): `src/ui/game-prefetch.ts`
 * is **157** LOC. Dedicated suites before this file: `game-prefetch.test.ts`
 * (4), `burn-1008-ui-cov-r2-prefetch.test.ts` (4), `mutation-ui2-game-prefetch`
 * (6) — happy-path start marks, Save-Data skip/throw, default max=3, and
 * import-failure clear under development MODE. Focused coverage residual
 * before this PR: lines **95.83%** / branches **83.78%** (L52 allow-flag,
 * L110 defensive `!load`, L156 no-window idle).
 *
 * This suite pins soft-fail residuals that stay thin after those suites:
 * source keep-sites for catch-clear / Save-Data / MODE short-circuit,
 * failure→retry recovery, connection soft edges, idle empty/max:0 /
 * unknown-only queues, idle cancel soft-fail when `cancelIdleCallback` is
 * missing, timeout-kind reset, and Save-Data not clearing an already-warm
 * mark. No network. No player-facing copy pins. No `src/` edits.
 *
 * Narrowed vs open drafts:
 * - #884 q-mp-404 idle-warm / PWA bootstrap — disjoint host (`src/pwa/*`);
 *   leave open (`contained`)
 * - #920 dice / #909 storage / #904 router / #902 error-boundary+offline —
 *   disjoint hosts; leave open (`contained`)
 * - No open draft into post898 owns `src/ui/game-prefetch.ts` soft-fail char
 *
 * Listed in `vitest.config.ts` `isolatedFiles` so `vi.resetModules()` +
 * game-controller `doMock` cannot leak into unit-shared controller suites.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('q-mp-453 game-prefetch — source soft-fail keep-sites', () => {
  it('keeps intentional import-failure soft-clear of started marks', () => {
    expect(PREFETCH_SRC).toMatch(/\.catch\(\(\)\s*=>\s*\{/);
    expect(PREFETCH_SRC).toMatch(/started\.delete\(gameId\)/);
  });

  it('keeps Save-Data soft-skip and connection try/catch soft-allow', () => {
    expect(PREFETCH_SRC).toMatch(/prefersSaveData/);
    expect(PREFETCH_SRC).toMatch(/saveData\s*===\s*true/);
    expect(PREFETCH_SRC).toMatch(/catch\s*\{/);
  });

  it('keeps MODE=test short-circuit so idle never schedules real imports', () => {
    expect(PREFETCH_SRC).toMatch(/import\.meta\.env\.MODE\s*!==\s*'test'/);
    expect(PREFETCH_SRC).toMatch(/shouldExecutePrefetchImport/);
  });

  it('registers exactly twenty practice loaders (structural soft-fail fence)', () => {
    // Multi-line arrow loaders (kings / remainder-islands) still count via
    // the shared game-controller dynamic-import keep-site.
    const controllerImports =
      PREFETCH_SRC.match(/import\('\.\.\/games\/[^']+\/game-controller'\)/g) ??
      [];
    expect(controllerImports).toHaveLength(20);
    for (const id of GAME_IDS) {
      expect(PREFETCH_SRC).toContain(`../games/${id}/game-controller`);
    }
  });
});

describe('q-mp-453 game-prefetch — MODE=test soft-fail residuals', () => {
  beforeEach(async () => {
    clearNavigatorConnection();
    const { resetGamePrefetchForTests } =
      await import('../../src/ui/game-prefetch');
    resetGamePrefetchForTests();
  });

  afterEach(async () => {
    const { resetGamePrefetchForTests } =
      await import('../../src/ui/game-prefetch');
    resetGamePrefetchForTests();
    clearNavigatorConnection();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('missing connection soft-allows prefetch (no Save-Data signal)', async () => {
    clearNavigatorConnection();
    const { prefetchGameChunk, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunk('hex');
    expect(isGamePrefetchStarted('hex')).toBe(true);
  });

  it('saveData undefined soft-allows prefetch', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: undefined },
    });
    const { prefetchGameChunk, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunk('calla');
    expect(isGamePrefetchStarted('calla')).toBe(true);
  });

  it('saveData null soft-allows prefetch (strict === true gate)', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: null },
    });
    const { prefetchGameChunk, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunk('fiar');
    expect(isGamePrefetchStarted('fiar')).toBe(true);
  });

  it('Save-Data after warm does not clear an already-started mark', async () => {
    const { prefetchGameChunk, isGamePrefetchStarted, canPrefetchGame } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunk('star-track');
    expect(isGamePrefetchStarted('star-track')).toBe(true);

    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    prefetchGameChunk('star-track');
    expect(isGamePrefetchStarted('star-track')).toBe(true);
    expect(canPrefetchGame('star-track')).toBe(true);
  });

  it('idle max:0 soft-fails to an empty queue (nothing started)', async () => {
    const { prefetchGameChunksIdle, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunksIdle(['hex', 'calla', 'fiar'], { max: 0 });
    expect(isGamePrefetchStarted('hex')).toBe(false);
    expect(isGamePrefetchStarted('calla')).toBe(false);
    expect(isGamePrefetchStarted('fiar')).toBe(false);
  });

  it('idle empty + unknown-only queues soft-fail without marks', async () => {
    const { prefetchGameChunksIdle, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunksIdle([]);
    prefetchGameChunksIdle(['bogus-a', 'bogus-b'], { max: 3 });
    expect(isGamePrefetchStarted('bogus-a')).toBe(false);
    expect(isGamePrefetchStarted('bogus-b')).toBe(false);
  });

  it('idle filters unknowns before max slice (soft residual order)', async () => {
    const { prefetchGameChunksIdle, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunksIdle(
      ['nope', 'hex', 'still-nope', 'calla', 'fiar', 'star-track'],
      { max: 2 }
    );
    expect(isGamePrefetchStarted('hex')).toBe(true);
    expect(isGamePrefetchStarted('calla')).toBe(true);
    expect(isGamePrefetchStarted('fiar')).toBe(false);
    expect(isGamePrefetchStarted('star-track')).toBe(false);
    expect(isGamePrefetchStarted('nope')).toBe(false);
  });

  it('unknown id soft-no-ops beside an already-warm known id', async () => {
    const { prefetchGameChunk, isGamePrefetchStarted } =
      await import('../../src/ui/game-prefetch');
    prefetchGameChunk('juggle');
    prefetchGameChunk('not-a-game');
    expect(isGamePrefetchStarted('juggle')).toBe(true);
    expect(isGamePrefetchStarted('not-a-game')).toBe(false);
  });
});

describe('q-mp-453 game-prefetch — development MODE soft-fail residuals', () => {
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

  it('import soft-fail clears started so a later retry can warm again', async () => {
    const failing = await loadPrefetch({ failIds: new Set(['hex']) });
    failing.prefetchGameChunk('hex');
    expect(failing.isGamePrefetchStarted('hex')).toBe(true);
    await vi.waitFor(() => {
      expect(failing.isGamePrefetchStarted('hex')).toBe(false);
    });

    // Reload with a healthy hex loader — soft-fail residual is recoverable.
    const healthy = await loadPrefetch();
    healthy.prefetchGameChunk('hex');
    expect(healthy.isGamePrefetchStarted('hex')).toBe(true);
    await vi.waitFor(() => {
      expect(healthy.isGamePrefetchStarted('hex')).toBe(true);
    });
    healthy.resetGamePrefetchForTests();
  });

  it('successful import soft-keeps the started mark (non-failure path)', async () => {
    const mod = await loadPrefetch();
    mod.prefetchGameChunk('calla');
    expect(mod.isGamePrefetchStarted('calla')).toBe(true);
    await Promise.resolve();
    await Promise.resolve();
    expect(mod.isGamePrefetchStarted('calla')).toBe(true);
    mod.resetGamePrefetchForTests();
  });

  it('idle ric path marks after callback; reset soft-cancels pending idle', async () => {
    vi.useFakeTimers();
    const cancelIdle = vi.fn();
    const ric = vi.fn((cb: IdleRequestCallback) => {
      return window.setTimeout(
        () => cb({} as IdleDeadline),
        40
      ) as unknown as number;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    vi.stubGlobal('cancelIdleCallback', cancelIdle);

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['hex', 'calla'], { max: 2 });
    expect(ric).toHaveBeenCalledTimes(1);
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);

    await vi.advanceTimersByTimeAsync(50);
    expect(mod.isGamePrefetchStarted('hex')).toBe(true);
    expect(mod.isGamePrefetchStarted('calla')).toBe(true);

    mod.prefetchGameChunksIdle(['fiar'], { max: 1 });
    expect(ric).toHaveBeenCalledTimes(2);
    mod.resetGamePrefetchForTests();
    expect(cancelIdle).toHaveBeenCalled();
    expect(mod.isGamePrefetchStarted('fiar')).toBe(false);
  });

  it('idle cancel soft-fail: missing cancelIdleCallback does not throw on reset', async () => {
    vi.useFakeTimers();
    const ric = vi.fn((_cb: IdleRequestCallback) => 77);
    vi.stubGlobal('requestIdleCallback', ric);
    // Ensure cancelIdleCallback is absent / non-function (soft residual branch).
    Object.defineProperty(window, 'cancelIdleCallback', {
      configurable: true,
      value: undefined,
    });

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['hex'], { max: 1 });
    expect(ric).toHaveBeenCalledTimes(1);
    expect(() => mod.resetGamePrefetchForTests()).not.toThrow();
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);
  });

  it('timeout-kind idle reset soft-clears via clearTimeout', async () => {
    vi.useFakeTimers();
    delete (window as Window & { requestIdleCallback?: unknown })
      .requestIdleCallback;
    const clearSpy = vi.spyOn(window, 'clearTimeout');

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['prime-gold'], { max: 1 });
    expect(mod.isGamePrefetchStarted('prime-gold')).toBe(false);

    mod.resetGamePrefetchForTests();
    expect(clearSpy).toHaveBeenCalled();
    expect(mod.isGamePrefetchStarted('prime-gold')).toBe(false);
  });

  it('timeout-kind idle completes and marks after 200ms soft delay', async () => {
    vi.useFakeTimers();
    delete (window as Window & { requestIdleCallback?: unknown })
      .requestIdleCallback;

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['stars-bars', 'bogus'], { max: 1 });
    expect(mod.isGamePrefetchStarted('stars-bars')).toBe(false);
    await vi.advanceTimersByTimeAsync(199);
    expect(mod.isGamePrefetchStarted('stars-bars')).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(mod.isGamePrefetchStarted('stars-bars')).toBe(true);
    expect(mod.isGamePrefetchStarted('bogus')).toBe(false);
    mod.resetGamePrefetchForTests();
  });

  it('Save-Data soft-skip under development MODE never marks started', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    const mod = await loadPrefetch();
    mod.prefetchGameChunk('hex');
    mod.prefetchGameChunksIdle(['calla', 'fiar'], { max: 2 });
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);
    expect(mod.isGamePrefetchStarted('calla')).toBe(false);
    expect(mod.isGamePrefetchStarted('fiar')).toBe(false);
    mod.resetGamePrefetchForTests();
  });
});
