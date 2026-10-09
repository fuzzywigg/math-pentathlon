/**
 * Fail-soft accessors for Web Storage (localStorage / sessionStorage).
 *
 * Browsers can throw SecurityError when storage is disabled (e.g. some Safari
 * private-mode configurations), QuotaExceededError on write, or return
 * non-JSON garbage from another origin/tab. Call sites should use these
 * helpers instead of hand-rolling try/catch around raw Storage APIs.
 *
 * IndexedDB and Cache Storage are unused by app code today (PWA precache is
 * Workbox-managed). This module intentionally covers Web Storage only.
 */

type WebStorageKind = 'local' | 'session';

export type SafeJsonParseResult =
  { ok: true; value: unknown } | { ok: false; error: unknown };

type SafeWriteResult = { ok: true } | { ok: false; error: unknown };

type SafeReadResult =
  { ok: true; value: string | null } | { ok: false; error: unknown };

const CROSS_TAB_FLAG = '__mpSafeWebStorageCrossTabBound';
const CROSS_TAB_HANDLER = '__mpSafeWebStorageCrossTabHandler';

function storageUnavailableError(): DOMException {
  return new DOMException(
    'Web Storage is unavailable or blocked',
    'SecurityError'
  );
}

type CrossTabTarget = Window &
  typeof globalThis & {
    [CROSS_TAB_FLAG]?: boolean;
    [CROSS_TAB_HANDLER]?: ((event: StorageEvent) => void) | null;
  };

function storageFromKind(kind: WebStorageKind): Storage | null {
  if (kind === 'local') {
    return globalThis.localStorage ?? null;
  }
  return globalThis.sessionStorage ?? null;
}

/**
 * Return a Storage object when readable, otherwise null.
 * Does not probe writes — quota-full stores still return successfully so
 * callers can soft-fail on setItem.
 */
export function getWebStorage(kind: WebStorageKind = 'local'): Storage | null {
  try {
    const store = storageFromKind(kind);
    if (store === null) {
      return null;
    }
    // Touch a read path — throws SecurityError when storage access is blocked.
    void store.getItem('__mp_storage_probe__');
    return store;
  } catch {
    return null;
  }
}

/**
 * Read a key with a structured result. Distinguishes missing keys
 * (`ok: true, value: null`) from SecurityError / blocked storage (`ok: false`)
 * so callers like StorageManager.load can warn on private-mode failures.
 */
export function safeGetItemResult(
  key: string,
  kind: WebStorageKind = 'local'
): SafeReadResult {
  try {
    const store = storageFromKind(kind);
    if (store === null) {
      return { ok: false, error: storageUnavailableError() };
    }
    return { ok: true, value: store.getItem(key) };
  } catch (error) {
    return { ok: false, error };
  }
}

/** Read a key; returns null when missing or when storage is unavailable. */
export function safeGetItem(
  key: string,
  kind: WebStorageKind = 'local'
): string | null {
  const result = safeGetItemResult(key, kind);
  return result.ok ? result.value : null;
}

/**
 * Write a key with a structured result (preserves QuotaExceededError /
 * SecurityError for callers that log diagnostics).
 */
export function safeSetItemResult(
  key: string,
  value: string,
  kind: WebStorageKind = 'local'
): SafeWriteResult {
  const store = getWebStorage(kind);
  if (!store) {
    return { ok: false, error: storageUnavailableError() };
  }
  try {
    store.setItem(key, value);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

/**
 * Write a key. Returns false on SecurityError, QuotaExceededError, or when
 * storage is unavailable — never throws.
 */
export function safeSetItem(
  key: string,
  value: string,
  kind: WebStorageKind = 'local'
): boolean {
  return safeSetItemResult(key, value, kind).ok;
}

/** Remove a key. Returns false when storage is unavailable or remove throws. */
export function safeRemoveItem(
  key: string,
  kind: WebStorageKind = 'local'
): boolean {
  const store = getWebStorage(kind);
  if (!store) {
    return false;
  }
  try {
    store.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** JSON.parse that never throws; treats empty/invalid input as failure. */
export function safeParseJson(
  raw: string | null | undefined
): SafeJsonParseResult {
  if (raw === null || raw === undefined || raw === '') {
    return { ok: false, error: new SyntaxError('Empty storage value') };
  }
  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch (error) {
    return { ok: false, error };
  }
}

/**
 * Subscribe to `window` `storage` events (other tabs only).
 * Idempotent: one listener per page; latest handler wins so module remounts
 * in tests do not stack listeners.
 */
export function subscribeStorageEvent(
  handler: (event: StorageEvent) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const target = window as CrossTabTarget;
  target[CROSS_TAB_HANDLER] = handler;

  if (!target[CROSS_TAB_FLAG]) {
    target[CROSS_TAB_FLAG] = true;
    window.addEventListener('storage', (event: StorageEvent) => {
      target[CROSS_TAB_HANDLER]?.(event);
    });
  }

  return () => {
    if (target[CROSS_TAB_HANDLER] === handler) {
      target[CROSS_TAB_HANDLER] = null;
    }
  };
}
