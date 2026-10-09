/**
 * burn-1008-mp-ui-coverage-round-2 — game-prefetch characterization.
 * Pins idle/import/failure/Save-Data paths that stay under 50% branch on tip
 * (MODE=test short-circuits real imports; opt into development MODE).
 * Tests-only; no product changes.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('burn-1008 ui-cov-r2 game-prefetch imports', () => {
  beforeEach(() => {
    vi.stubEnv('MODE', 'development');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  async function loadPrefetch() {
    vi.resetModules();
    for (const id of GAME_IDS) {
      vi.doMock(`../../src/games/${id}/game-controller`, () => ({
        default: { id },
      }));
    }
    const mod = await import('../../src/ui/game-prefetch');
    mod.resetGamePrefetchForTests();
    return mod;
  }

  it('executes every registered loader and clears started on import failure', async () => {
    const mod = await loadPrefetch();

    for (const id of GAME_IDS) {
      mod.prefetchGameChunk(id);
      expect(mod.isGamePrefetchStarted(id)).toBe(true);
    }

    // Force one failure path: re-mock hex to reject after reset
    mod.resetGamePrefetchForTests();
    vi.resetModules();
    vi.stubEnv('MODE', 'development');
    vi.doMock('../../src/games/hex/game-controller', () => {
      throw new Error('prefetch-fail');
    });
    for (const id of GAME_IDS) {
      if (id === 'hex') continue;
      vi.doMock(`../../src/games/${id}/game-controller`, () => ({
        default: { id },
      }));
    }
    const mod2 = await import('../../src/ui/game-prefetch');
    mod2.resetGamePrefetchForTests();
    mod2.prefetchGameChunk('hex');
    expect(mod2.isGamePrefetchStarted('hex')).toBe(true);
    await vi.waitFor(() => {
      expect(mod2.isGamePrefetchStarted('hex')).toBe(false);
    });
    mod2.resetGamePrefetchForTests();
  });

  it('idle path uses requestIdleCallback and cancelIdleCallback on reset', async () => {
    vi.useFakeTimers();
    const cancelIdle = vi.fn();
    const ric = vi.fn((cb: IdleRequestCallback) => {
      // Defer so idleHandle is set before run()
      return window.setTimeout(() => cb({} as IdleDeadline), 50) as unknown as number;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    vi.stubGlobal('cancelIdleCallback', cancelIdle);

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['hex', 'calla'], { max: 2 });
    expect(ric).toHaveBeenCalled();
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);

    mod.resetGamePrefetchForTests();
    expect(cancelIdle).toHaveBeenCalled();
  });

  it('idle path falls back to setTimeout when requestIdleCallback missing', async () => {
    vi.useFakeTimers();
    delete (window as Window & { requestIdleCallback?: unknown })
      .requestIdleCallback;

    const mod = await loadPrefetch();
    mod.prefetchGameChunksIdle(['hex'], { max: 1 });
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);
    await vi.advanceTimersByTimeAsync(250);
    expect(mod.isGamePrefetchStarted('hex')).toBe(true);

    // Reset clears timeout-kind handle
    mod.prefetchGameChunksIdle(['calla'], { max: 1 });
    mod.resetGamePrefetchForTests();
    expect(mod.isGamePrefetchStarted('calla')).toBe(false);
  });

  it('skips prefetch when Save-Data is enabled', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    const mod = await loadPrefetch();
    mod.prefetchGameChunk('hex');
    expect(mod.isGamePrefetchStarted('hex')).toBe(false);
    delete (navigator as Navigator & { connection?: unknown }).connection;
  });
});
