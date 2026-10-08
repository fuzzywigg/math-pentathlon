import { registerPwa } from './register';
import { registerSW as defaultRegisterSW } from './sw-register';

export type BootstrapPwaOptions = {
  /** Injected for tests. */
  schedule?: (cb: () => void) => void;
  /** When false, skip registration. Default: true in browsers. */
  enabled?: boolean;
  /** Injected for tests; defaults to vite-plugin-pwa virtual module. */
  registerSW?: typeof import('virtual:pwa-register').registerSW;
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
    // Defer SW install/precache so first paint JS/CSS/font win the radio.
    ric(() => cb(), { timeout: 3_000 });
    return;
  }
  window.setTimeout(cb, 1_000);
}

/** Wire the generated service worker after idle / first paint. */
export function bootstrapPwa(options: BootstrapPwaOptions = {}): void {
  const enabled =
    options.enabled ??
    (typeof window !== 'undefined' && typeof document !== 'undefined');
  if (!enabled) return;

  const schedule = options.schedule ?? defaultSchedule;
  const sw = options.registerSW ?? defaultRegisterSW;
  schedule(() => {
    registerPwa({ registerSW: sw });
  });
}
