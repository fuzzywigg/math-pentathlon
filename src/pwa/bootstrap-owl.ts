/**
 * Lazy Ollie bootstrap — keeps owl core/UI off the menu critical path.
 */

type BootstrapOwlOptions = {
  schedule?: (cb: () => void) => void;
  enabled?: boolean;
  /** Injected for tests. */
  importOwl?: () => Promise<typeof import('../core/owl')>;
  /** Injected for tests. */
  importOwlUi?: () => Promise<typeof import('../ui/owl')>;
};

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
    ric(
      () => {
        cb();
      },
      { timeout: 2_500 }
    );
    return;
  }
  window.setTimeout(cb, 800);
}

/** Init owl UI + system after first paint / idle. */
export function bootstrapOwl(options: BootstrapOwlOptions = {}): void {
  const enabled =
    options.enabled ??
    (typeof window !== 'undefined' && typeof document !== 'undefined');
  if (!enabled) {
    return;
  }

  const schedule = options.schedule ?? defaultSchedule;
  const importOwl = options.importOwl ?? (() => import('../core/owl'));
  const importOwlUi = options.importOwlUi ?? (() => import('../ui/owl'));

  schedule(() => {
    void (async () => {
      try {
        const [{ owlSystem }, { owlComponent }] = await Promise.all([
          importOwl(),
          importOwlUi(),
        ]);
        owlComponent.init();
        owlSystem.initialize();
      } catch (err) {
        // Best-effort mascot — menu/games must still load if owl chunks fail.
        console.error('[bootstrap-owl] init failed', err);
      }
    })();
  });
}
