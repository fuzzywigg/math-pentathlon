/**
 * Lazy Ollie bootstrap — keeps owl core/UI off the menu critical path.
 */

export type BootstrapOwlOptions = {
  schedule?: (cb: () => void) => void;
  enabled?: boolean;
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
    ric(() => cb(), { timeout: 2_500 });
    return;
  }
  window.setTimeout(cb, 800);
}

/** Init owl UI + system after first paint / idle. */
export function bootstrapOwl(options: BootstrapOwlOptions = {}): void {
  const enabled =
    options.enabled ??
    (typeof window !== 'undefined' && typeof document !== 'undefined');
  if (!enabled) return;

  const schedule = options.schedule ?? defaultSchedule;

  schedule(() => {
    void (async () => {
      const [{ owlSystem }, { owlComponent }] = await Promise.all([
        import('../core/owl'),
        import('../ui/owl'),
      ]);
      owlComponent.init();
      owlSystem.initialize();
    })();
  });
}
