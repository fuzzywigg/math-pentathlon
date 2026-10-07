/**
 * Warm game controller chunks before the kid taps "play".
 *
 * Uses the same dynamic-import paths as `main.ts` so Vite emits shared chunks.
 * Safe on flaky school Wi‑Fi: failures clear the in-flight mark so a later
 * hover / idle pass can retry; never blocks navigation.
 */

const loaders: Record<string, () => Promise<unknown>> = {
  'kings-quadraphages': () =>
    import('../games/kings-quadraphages/game-controller'),
  hex: () => import('../games/hex/game-controller'),
  'star-track': () => import('../games/star-track/game-controller'),
  'hex-a-gone': () => import('../games/hex-a-gone/game-controller'),
  calla: () => import('../games/calla/game-controller'),
  fiar: () => import('../games/fiar/game-controller'),
  'queens-guards': () => import('../games/queens-guards/game-controller'),
  'contig-60': () => import('../games/contig-60/game-controller'),
  juggle: () => import('../games/juggle/game-controller'),
  'fab-a-diffy': () => import('../games/fab-a-diffy/game-controller'),
  'sum-dominoes': () => import('../games/sum-dominoes/game-controller'),
  'par-55': () => import('../games/par-55/game-controller'),
  ramrod: () => import('../games/ramrod/game-controller'),
  'kwatro-sinko': () => import('../games/kwatro-sinko/game-controller'),
  'prime-gold': () => import('../games/prime-gold/game-controller'),
  'pent-em-in': () => import('../games/pent-em-in/game-controller'),
  'frac-fact': () => import('../games/frac-fact/game-controller'),
  'remainder-islands': () =>
    import('../games/remainder-islands/game-controller'),
  'fraction-pinball': () => import('../games/fraction-pinball/game-controller'),
  'stars-bars': () => import('../games/stars-bars/game-controller'),
};

const started = new Set<string>();

/** Reset between tests. */
export function resetGamePrefetchForTests(): void {
  started.clear();
}

export function isGamePrefetchStarted(gameId: string): boolean {
  return started.has(gameId);
}

export function canPrefetchGame(gameId: string): boolean {
  return Object.prototype.hasOwnProperty.call(loaders, gameId);
}

/**
 * Kick off a background import for `gameId` (no-op if unknown / already warm).
 */
export function prefetchGameChunk(gameId: string): void {
  if (!canPrefetchGame(gameId) || started.has(gameId)) return;
  started.add(gameId);
  const load = loaders[gameId];
  void load().catch(() => {
    started.delete(gameId);
  });
}

/**
 * Prefetch a short list during idle time (first open division, etc.).
 * Caps concurrent work to avoid saturating a cheap tablet radio.
 */
export function prefetchGameChunksIdle(
  gameIds: string[],
  options: { max?: number } = {}
): void {
  const max = options.max ?? 3;
  const queue = gameIds.filter((id) => canPrefetchGame(id)).slice(0, max);

  const run = (): void => {
    for (const id of queue) {
      prefetchGameChunk(id);
    }
  };

  const w = typeof window === 'undefined' ? null : window;
  if (w && typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(run, { timeout: 2500 });
    return;
  }

  if (w) {
    w.setTimeout(run, 200);
    return;
  }

  run();
}
