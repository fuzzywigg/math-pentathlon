/**
 * Service worker registration + update strategy for offline play.
 *
 * Strategy (autoUpdate):
 * - Workbox precaches the full build (shell + every game/3D chunk) on first visit.
 * - New deploys ship a new SW; `registerSW({ immediate: true })` checks on load.
 * - When a waiting worker takes control (`onNeedRefresh` / controllerchange),
 *   we reload once so kids are not stuck on a stale broken build.
 * - Hashed assets stay cache-first; HTML/SW revalidate when online.
 *
 * iOS Safari notes: SW works for Add to Home Screen and browser tabs after
 * first install; storage can be reclaimed under pressure — a later online
 * visit re-precaches. No Background Sync dependency.
 */

type RegisterPwaOptions = {
  /** Injected for tests; defaults to vite-plugin-pwa virtual module. */
  registerSW?: typeof import('virtual:pwa-register').registerSW;
  reload?: () => void;
  /** When false, skip registration (e.g. unsupported browsers). */
  enabled?: boolean;
};

type RegisterPwaResult = {
  /** Workbox `registerSW` may return a Promise-returning updater. */
  update?: () => void | Promise<void>;
};

let reloadScheduled = false;
/** Periodic SW update check — cleared on re-register so intervals do not stack. */
let updateCheckInterval: ReturnType<typeof setInterval> | null = null;

export function resetPwaReloadGuardForTests(): void {
  reloadScheduled = false;
  if (updateCheckInterval !== null) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
}

/**
 * Register the service worker and reload once when a new version activates.
 */
export function registerPwa(
  options: RegisterPwaOptions = {}
): RegisterPwaResult {
  const enabled =
    options.enabled ??
    (typeof navigator !== 'undefined' && 'serviceWorker' in navigator);

  if (!enabled || !options.registerSW) {
    return {};
  }

  const reload = options.reload ?? (() => window.location.reload());

  try {
    const updateSW = options.registerSW({
      immediate: true,
      onNeedRefresh() {
        scheduleReload(reload);
      },
      onOfflineReady() {
        // Precache complete — app is ready for airplane mode.
      },
      onRegisteredSW(_swUrl, registration) {
        // Periodic update check while the tab stays open (school Wi‑Fi flaps).
        if (!registration) {
          return;
        }
        if (updateCheckInterval !== null) {
          clearInterval(updateCheckInterval);
          updateCheckInterval = null;
        }
        const hourMs = 60 * 60 * 1000;
        updateCheckInterval = window.setInterval(() => {
          // Soft-fail: update() rejection must not surface as unhandledrejection.
          void Promise.resolve(registration.update()).catch((err: unknown) => {
            console.error('[pwa] service worker update check failed', err);
          });
        }, hourMs);
      },
    });

    return { update: updateSW };
  } catch (err) {
    // SW registration is best-effort — online play must survive a throw.
    console.error('[pwa] service worker registration failed', err);
    return {};
  }
}

function scheduleReload(reload: () => void): void {
  if (reloadScheduled) {
    return;
  }
  reloadScheduled = true;

  const doReload = () => {
    reload();
  };

  if (
    typeof document !== 'undefined' &&
    document.visibilityState === 'hidden'
  ) {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', onVisible);
        doReload();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return;
  }

  doReload();
}
