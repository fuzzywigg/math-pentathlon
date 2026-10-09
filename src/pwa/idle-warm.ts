/**
 * After the menu paints, warm route-mount + play-CSS + a couple of popular
 * game chunks on idle so the first tap feels snappier — and so SPA soft-nav
 * can mount those games from the in-memory module map if a controlled fetch
 * later fails (seen under Playwright WebKit `setOffline`).
 *
 * Skips when the user has Save-Data enabled or when the document is hidden.
 */

export type IdleWarmOptions = {
  /** Injected for tests. */
  schedule?: (cb: () => void) => void;
  /** Injected for tests — replaces per-game controller imports only. */
  importGame?: (gameId: string) => Promise<unknown>;
  /** Injected for tests — replaces route-mount + play-CSS warm imports. */
  importShell?: () => Promise<unknown>;
  /** When false, no-op (e.g. unsupported). Default: true in browsers. */
  enabled?: boolean;
};

const DEFAULT_WARM_GAMES = ['hex', 'kings-quadraphages'] as const;

/** data-* marker so e2e can wait for warm without fixed sleeps. */
export const IDLE_WARM_DONE_ATTR = 'data-mp-idle-warm';

function defaultSchedule(cb: () => void): void {
  const ric = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        opts?: IdleRequestOptions
      ) => number;
    }
  ).requestIdleCallback;

  if (typeof ric === 'function') {
    ric(() => cb(), { timeout: 4_000 });
    return;
  }
  window.setTimeout(cb, 1_500);
}

function prefersSaveData(): boolean {
  try {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    return conn?.saveData === true;
  } catch {
    return false;
  }
}

async function defaultImportShell(): Promise<unknown> {
  // Same dynamic-import paths as renderGame() in main.ts.
  return await Promise.all([
    import('../ui/game-route-mounts'),
    import('../ui/styles/game-play.css'),
  ]);
}

async function defaultImportGame(
  gameId: (typeof DEFAULT_WARM_GAMES)[number]
): Promise<unknown> {
  switch (gameId) {
    case 'hex':
      return await import('../games/hex/game-controller');
    case 'kings-quadraphages':
      return await import('../games/kings-quadraphages/game-controller');
    default: {
      const _exhaustive: never = gameId;
      return _exhaustive;
    }
  }
}

function markWarmDone(): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.setAttribute(IDLE_WARM_DONE_ATTR, 'done');
}

/**
 * Schedule background warm-imports of shell route chunks + popular games.
 */
export function scheduleIdleGameWarm(options: IdleWarmOptions = {}): void {
  const enabled =
    options.enabled ??
    (typeof window !== 'undefined' && typeof document !== 'undefined');

  if (!enabled) {
    return;
  }

  const schedule = options.schedule ?? defaultSchedule;
  const importGame = options.importGame ?? defaultImportGame;
  const importShell = options.importShell ?? defaultImportShell;

  schedule(() => {
    if (document.hidden || prefersSaveData()) {
      markWarmDone();
      return;
    }

    void (async () => {
      try {
        if (!document.hidden && !prefersSaveData()) {
          try {
            await importShell();
          } catch {
            // Shell warm is best-effort — SW precache still covers Chromium/FF.
          }
        }

        for (const gameId of DEFAULT_WARM_GAMES) {
          if (document.hidden || prefersSaveData()) {
            break;
          }
          try {
            await importGame(gameId);
          } catch {
            // Warm is best-effort — SW precache still covers offline.
          }
        }
      } finally {
        markWarmDone();
      }
    })();
  });
}
