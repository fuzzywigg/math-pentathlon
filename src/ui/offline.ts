/**
 * Lightweight offline helpers for load-error copy and chrome.
 * Does not depend on the service worker — `navigator.onLine` only.
 */

export function isBrowserOffline(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.onLine === false;
}

/** Hint shown under the game-load error title. */
export function gameLoadErrorHint(offline = isBrowserOffline()): string {
  if (offline) {
    return 'You appear to be offline. Connect once so this game can download, then try again.';
  }
  return 'Check your connection, then try again.';
}

/**
 * Toggle `data-offline` on `<html>` and keep it synced with online/offline events.
 * Returns an unsubscribe function.
 */
export function bindOfflineDocumentFlag(): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return () => undefined;
  }

  const sync = (): void => {
    if (isBrowserOffline()) {
      document.documentElement.setAttribute('data-offline', 'true');
    } else {
      document.documentElement.removeAttribute('data-offline');
    }
  };

  sync();
  window.addEventListener('online', sync);
  window.addEventListener('offline', sync);
  return () => {
    window.removeEventListener('online', sync);
    window.removeEventListener('offline', sync);
  };
}
