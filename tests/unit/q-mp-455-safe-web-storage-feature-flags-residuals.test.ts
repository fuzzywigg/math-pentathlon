/**
 * q-mp-455 — Characterize `safe-web-storage` + `feature-flags` residuals
 * (tests-only).
 *
 * Structural / soft-fail asserts only. No player-facing copy pins. No `src/`
 * product edits. No AI / rules / scoring / timing paths. Hex Hard 450ms
 * untouched. Disjoint from `#909`/`q-mp-420` (`storage.ts` soft-fail) and from
 * `#859`/`q-mp-378` (settings-flags).
 *
 * Live tip re-measure (`cursor/mp-tip-post898` @ `6404a8e6`):
 * - `safe-web-storage.ts` **185** LOC / **4** dedicated test files
 *   (`safe-web-storage`, remount, mutation-ui, mutation-ui10)
 * - `feature-flags.ts` **35** LOC / **2** dedicated test files
 *   (`mp3d-feature-flags`, mutation-ui-feature-flags)
 * Prior suites cover SecurityError/QuotaExceeded happy soft-fail, StorageManager
 * cross-tab, remount ctor, board3d ON/OFF basics, and mutation kill pins.
 * This file targets residual edges: default kind, session-null / session-throw,
 * setItem SecurityError with readable store, parse empty SyntaxError shape,
 * subscribe after clear / SSR no-op, feature-flag precedence + junk tokens +
 * null-storage peek + throwing StorageLike.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BOARD_3D_PARAM,
  BOARD_3D_STORAGE_KEY,
  isBoard3dEnabled,
} from '../../src/core/feature-flags';
import {
  getWebStorage,
  safeGetItem,
  safeGetItemResult,
  safeParseJson,
  safeRemoveItem,
  safeSetItem,
  safeSetItemResult,
  subscribeStorageEvent,
} from '../../src/core/safe-web-storage';
import {
  quotaError,
  securityError,
  withThrowingLocalStorageAccess,
} from '../helpers/storage-stubs';

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = { ...initial };
  return {
    get length() {
      return Object.keys(data).length;
    },
    clear() {
      for (const k of Object.keys(data)) delete data[k];
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key)
        ? data[key]!
        : null;
    },
    key(index: number) {
      return Object.keys(data)[index] ?? null;
    },
    removeItem(key: string) {
      delete data[key];
    },
    setItem(key: string, value: string) {
      data[key] = String(value);
    },
  };
}

async function withThrowingSessionStorageAccess<T>(
  fn: () => T | Promise<T>,
  message = 'session blocked'
): Promise<T> {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get() {
      throw securityError(message);
    },
  });
  try {
    return await fn();
  } finally {
    if (original) {
      Object.defineProperty(globalThis, 'sessionStorage', original);
    }
  }
}

async function withNullSessionStorage<T>(fn: () => T | Promise<T>): Promise<T> {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get() {
      return null;
    },
  });
  try {
    return await fn();
  } finally {
    if (original) {
      Object.defineProperty(globalThis, 'sessionStorage', original);
    }
  }
}

describe('q-mp-455 safe-web-storage — kind / session residuals', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('getWebStorage() defaults to local without an explicit kind', () => {
    expect(getWebStorage()).toBe(localStorage);
    expect(getWebStorage()).not.toBe(sessionStorage);
  });

  it('session CRUD via safe* helpers stays on sessionStorage', () => {
    expect(safeSetItem('q455-s', 'v', 'session')).toBe(true);
    expect(sessionStorage.getItem('q455-s')).toBe('v');
    expect(localStorage.getItem('q455-s')).toBeNull();
    expect(safeGetItem('q455-s', 'session')).toBe('v');
    expect(safeGetItem('q455-s', 'local')).toBeNull();
    const result = safeGetItemResult('q455-s', 'session');
    expect(result).toEqual({ ok: true, value: 'v' });
    expect(safeRemoveItem('q455-s', 'session')).toBe(true);
    expect(sessionStorage.getItem('q455-s')).toBeNull();
  });

  it('null sessionStorage fails soft for get / set / remove', async () => {
    await withNullSessionStorage(() => {
      expect(getWebStorage('session')).toBeNull();
      const read = safeGetItemResult('k', 'session');
      expect(read.ok).toBe(false);
      if (!read.ok) {
        expect((read.error as DOMException).name).toBe('SecurityError');
      }
      expect(safeGetItem('k', 'session')).toBeNull();
      const write = safeSetItemResult('k', 'v', 'session');
      expect(write.ok).toBe(false);
      expect(safeSetItem('k', 'v', 'session')).toBe(false);
      expect(safeRemoveItem('k', 'session')).toBe(false);
    });
  });

  it('throwing sessionStorage access fails soft without touching local', async () => {
    localStorage.setItem('keep-local', '1');
    await withThrowingSessionStorageAccess(() => {
      expect(getWebStorage('session')).toBeNull();
      expect(safeGetItem('any', 'session')).toBeNull();
      expect(safeSetItem('any', 'v', 'session')).toBe(false);
      expect(safeRemoveItem('any', 'session')).toBe(false);
    });
    expect(localStorage.getItem('keep-local')).toBe('1');
    expect(getWebStorage('local')).toBe(localStorage);
  });

  it('safeSetItemResult preserves setItem SecurityError when store is readable', () => {
    const err = securityError('write blocked');
    // Probe read succeeds so getWebStorage returns the store; write then throws.
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw err;
    });
    const result = safeSetItemResult('q455-sec', 'v', 'local');
    expect(setSpy).toHaveBeenCalled();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(err);
      expect((result.error as DOMException).name).toBe('SecurityError');
    }
    expect(safeSetItem('q455-sec', 'v')).toBe(false);
  });

  it('safeSetItemResult still reports QuotaExceededError on session kind', () => {
    const err = quotaError('session quota');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw err;
    });
    const result = safeSetItemResult('q455-q', 'v', 'session');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(err);
    }
  });

  it('safeParseJson empty/null/undefined fail with SyntaxError shape', () => {
    for (const raw of [null, undefined, ''] as const) {
      const result = safeParseJson(raw);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(SyntaxError);
        expect(String((result.error as Error).message)).toMatch(/Empty storage value/);
      }
    }
    const garbage = safeParseJson('{nope');
    expect(garbage.ok).toBe(false);
    if (!garbage.ok) {
      expect(garbage.error).toBeInstanceOf(SyntaxError);
    }
  });

  it('safeGetItemResult ok:true returns the stored string (not null)', () => {
    localStorage.setItem('q455-present', 'payload');
    expect(safeGetItemResult('q455-present')).toEqual({
      ok: true,
      value: 'payload',
    });
    expect(safeGetItem('q455-present')).toBe('payload');
  });
});

describe('q-mp-455 safe-web-storage — subscribe residuals', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // Clear cross-tab handler so later suites do not inherit a leftover listener.
    const unsub = subscribeStorageEvent(() => undefined);
    unsub();
  });

  it('after unsubscribe, storage events are no-ops; re-subscribe delivers again', () => {
    const first = vi.fn();
    const unsub = subscribeStorageEvent(first);
    window.dispatchEvent(new StorageEvent('storage', { key: 'a' }));
    expect(first).toHaveBeenCalledOnce();
    unsub();
    window.dispatchEvent(new StorageEvent('storage', { key: 'b' }));
    expect(first).toHaveBeenCalledOnce();

    const second = vi.fn();
    const unsub2 = subscribeStorageEvent(second);
    window.dispatchEvent(new StorageEvent('storage', { key: 'c' }));
    expect(second).toHaveBeenCalledOnce();
    expect(first).toHaveBeenCalledOnce();
    unsub2();
  });

  it('subscribeStorageEvent is a no-op when window is undefined (SSR)', () => {
    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      const handler = vi.fn();
      const unsub = subscribeStorageEvent(handler);
      expect(typeof unsub).toBe('function');
      expect(() => unsub()).not.toThrow();
      expect(handler).not.toHaveBeenCalled();
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
    }
  });
});

describe('q-mp-455 feature-flags — precedence / junk / soft-fail residuals', () => {
  afterEach(() => {
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    window.history.replaceState(null, '', '/');
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('exports stable board3d param and storage key constants', () => {
    expect(BOARD_3D_PARAM).toBe('board3d');
    expect(BOARD_3D_STORAGE_KEY).toBe('mp-board3d');
  });

  it('non-allowlisted search tokens fall through to storage', () => {
    const on = memoryStorage({ [BOARD_3D_STORAGE_KEY]: '1' });
    expect(isBoard3dEnabled('?board3d=yes', on)).toBe(true);
    expect(isBoard3dEnabled('?board3d=on', on)).toBe(true);
    expect(isBoard3dEnabled('?board3d=<script>', on)).toBe(true);
    expect(isBoard3dEnabled('?board3d=yes', memoryStorage())).toBe(false);
  });

  it('hash board3d=0 forces OFF even when storage is ON', () => {
    const on = memoryStorage({ [BOARD_3D_STORAGE_KEY]: '1' });
    expect(
      isBoard3dEnabled('', on, '#/game/hex-a-gone?board3d=0')
    ).toBe(false);
    expect(
      isBoard3dEnabled('', on, '#/game/hex-a-gone?board3d=false')
    ).toBe(false);
  });

  it('search wins over conflicting hash (ON beats OFF; OFF beats ON)', () => {
    const storage = memoryStorage();
    expect(
      isBoard3dEnabled('?board3d=1', storage, '#/g?board3d=0')
    ).toBe(true);
    expect(
      isBoard3dEnabled('?board3d=0', storage, '#/g?board3d=1')
    ).toBe(false);
  });

  it('storage true token enables; junk and false stay OFF', () => {
    expect(
      isBoard3dEnabled('', memoryStorage({ [BOARD_3D_STORAGE_KEY]: 'true' }))
    ).toBe(true);
    expect(
      isBoard3dEnabled('', memoryStorage({ [BOARD_3D_STORAGE_KEY]: 'TRUE' }))
    ).toBe(true);
    expect(
      isBoard3dEnabled('', memoryStorage({ [BOARD_3D_STORAGE_KEY]: 'yes' }))
    ).toBe(false);
    expect(
      isBoard3dEnabled('', memoryStorage({ [BOARD_3D_STORAGE_KEY]: '0' }))
    ).toBe(false);
    expect(
      isBoard3dEnabled('', memoryStorage({ [BOARD_3D_STORAGE_KEY]: 'false' }))
    ).toBe(false);
  });

  it('trimmed mixed-case URL tokens enable through isBoard3dEnabled', () => {
    expect(isBoard3dEnabled('?board3d=%20True%20', memoryStorage())).toBe(true);
    expect(isBoard3dEnabled('?board3d=TRUE', memoryStorage())).toBe(true);
    expect(isBoard3dEnabled('?board3d=False', memoryStorage())).toBe(false);
  });

  it('null storage peeks localStorage via getWebStorage soft path', async () => {
    localStorage.setItem(BOARD_3D_STORAGE_KEY, '1');
    expect(isBoard3dEnabled('', null, '')).toBe(true);
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    expect(isBoard3dEnabled('', null, '')).toBe(false);

    await withThrowingLocalStorageAccess(() => {
      expect(() => isBoard3dEnabled('', null, '')).not.toThrow();
      expect(isBoard3dEnabled('', null, '')).toBe(false);
    });
  });

  it('StorageLike getItem throw fails soft to OFF', () => {
    const boom = {
      getItem: () => {
        throw securityError('flag peek blocked');
      },
    };
    expect(() => isBoard3dEnabled('', boom, '')).not.toThrow();
    expect(isBoard3dEnabled('', boom, '')).toBe(false);
  });

  it('hash without ? never enables from path alone', () => {
    expect(isBoard3dEnabled('', memoryStorage(), '#/game/hex?x=1')).toBe(
      false
    );
    expect(isBoard3dEnabled('', memoryStorage(), '#board3d=1')).toBe(false);
    expect(
      isBoard3dEnabled(
        '',
        memoryStorage({ [BOARD_3D_STORAGE_KEY]: '1' }),
        '#/game/hex'
      )
    ).toBe(true);
  });

  it('no-arg call stays OFF when search/hash/storage unset (window defaults)', () => {
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    window.history.replaceState(null, '', '/');
    window.location.hash = '';
    expect(isBoard3dEnabled()).toBe(false);
  });
});
