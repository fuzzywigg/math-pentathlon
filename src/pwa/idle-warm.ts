/**
 * After the menu paints, warm a couple of small game chunks on idle so the
 * first tap feels snappier on tablets — without competing with first paint.
 *
 * Skips when the user has Save-Data enabled or when the document is hidden.
 */

export type IdleWarmOptions = {
  /** Injected for tests. */
  schedule?: (cb: () => void) => void;
  /** Injected for tests. */
  importGame?: (gameId: string) => Promise<unknown>;
  /** When false, no-op (e.g. unsupported). Default: true in browsers. */
  enabled?: boolean;
};

const DEFAULT_WARM_GAMES = ['hex', 'kings-quadraphages'] as const;

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

async function defaultImportGame(
  gameId: (typeof DEFAULT_WARM_GAMES)[number]
): Promise<unknown> {
  switch (gameId) {
    case 'hex':
      return import('../games/hex/game-controller');
    case 'kings-quadraphages':
      return import('../games/kings-quadraphages/game-controller');
    default: {
      const _exhaustive: never = gameId;
      return _exhaustive;
    }
  }
}

/**
 * Schedule background warm-imports of a few popular game controllers.
 */
export function scheduleIdleGameWarm(options: IdleWarmOptions = {}): void {
  const enabled =
    options.enabled ??
    (typeof window !== 'undefined' && typeof document !== 'undefined');

  if (!enabled) return;

  const schedule = options.schedule ?? defaultSchedule;
  const importGame = options.importGame ?? defaultImportGame;

  schedule(() => {
    if (document.hidden || prefersSaveData()) return;

    void (async () => {
      for (const gameId of DEFAULT_WARM_GAMES) {
        if (document.hidden || prefersSaveData()) return;
        try {
          await importGame(gameId);
        } catch {
          // Warm is best-effort — SW precache still covers offline.
        }
      }
    })();
  });
}
