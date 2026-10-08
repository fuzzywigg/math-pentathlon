import { registerSW as defaultRegisterSW } from 'virtual:pwa-register';
import { registerPwa } from './register';

export type BootstrapPwaOptions = {
  /** Injected for tests. */
  schedule?: (cb: () => void) => void;
  /** Injected for tests; defaults to vite-plugin-pwa virtual module. */
  registerSW?: typeof defaultRegisterSW;
  /** When false, skip registration. Default: true in browsers. */
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
  const registerSW = options.registerSW ?? defaultRegisterSW;
  schedule(() => {
    registerPwa({ registerSW });
  });
}
