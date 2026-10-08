/**
 * burn-1008-mp-ui-coverage-round-3 — safe-web-storage null-store paths,
 * url-flags search/hash edges, router default 404, storage cross-tab edges.
 * Tests-only; pins current behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getWebStorage,
  safeGetItemResult,
  safeRemoveItem,
  subscribeStorageEvent,
} from '../../src/core/safe-web-storage';
import { readUrlOrStorageFlag } from '../../src/core/url-flags';
import {
  addRoute,
  getPathParams,
  handleRoute,
  setNotFoundHandler,
} from '../../src/core/router';
import { storage } from '../../src/core/storage';

describe('burn-1008 ui-cov-r3 safe-web-storage null store', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getWebStorage / safeGetItemResult treat null Storage as unavailable', () => {
    const localDesc = Object.getOwnPropertyDescriptor(
      globalThis,
      'localStorage'
    );
    const sessionDesc = Object.getOwnPropertyDescriptor(
      globalThis,
      'sessionStorage'
    );
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: null,
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: null,
    });
    try {
      expect(getWebStorage('local')).toBeNull();
      expect(getWebStorage('session')).toBeNull();
      const read = safeGetItemResult('k', 'local');
      expect(read.ok).toBe(false);
      expect(safeRemoveItem('k', 'local')).toBe(false);
    } finally {
      if (localDesc) {
        Object.defineProperty(globalThis, 'localStorage', localDesc);
      }
      if (sessionDesc) {
        Object.defineProperty(globalThis, 'sessionStorage', sessionDesc);
      }
    }
  });

  it('safeRemoveItem returns false when removeItem throws', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(safeRemoveItem('any')).toBe(false);
  });

  it('subscribeStorageEvent replaces handler and clears on unsubscribe', () => {
    const a = vi.fn();
    const b = vi.fn();
    const unsubA = subscribeStorageEvent(a);
    const unsubB = subscribeStorageEvent(b);
    window.dispatchEvent(new StorageEvent('storage', { key: 'x' }));
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
    unsubB();
    window.dispatchEvent(new StorageEvent('storage', { key: 'y' }));
    expect(b).toHaveBeenCalledTimes(1);
    unsubA();
  });
});

describe('burn-1008 ui-cov-r3 url-flags edges', () => {
  it('accepts search without leading ? and empty search falls through', () => {
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', 'board3d=1', '', null)
    ).toBe(true);
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', {
        getItem: () => '1',
      })
    ).toBe(true);
  });

  it('hash without ? skips hash branch; storage getItem throw → false', () => {
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '#/game/hex', {
        getItem: () => {
          throw new Error('boom');
        },
      })
    ).toBe(false);
  });

  it('storage null uses safeGetItem path', () => {
    localStorage.setItem('mp-board3d', '1');
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', null)
    ).toBe(true);
    localStorage.removeItem('mp-board3d');
  });
});

describe('burn-1008 ui-cov-r3 router', () => {
  beforeEach(() => {
    window.location.hash = '';
    setNotFoundHandler(() => {
      console.error('Route not found');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('default notFoundHandler logs via console.error', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.location.hash = '#/no-such-route-r3';
    handleRoute();
    expect(err).toHaveBeenCalled();
  });

  it('getPathParams returns {} on non-match and extracts id on match', () => {
    expect(getPathParams('/game/:id', '/other')).toEqual({});
    addRoute('/probe-r3/:id', () => undefined);
    expect(getPathParams('/probe-r3/:id', '/probe-r3/abc')).toEqual({
      id: 'abc',
    });
  });
});

describe('burn-1008 ui-cov-r3 storage cross-tab', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('ignores sessionStorage-area events and unrelated keys', () => {
    const before = storage.getTotalGamesPlayed();
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: 'mp-progress',
        newValue: null,
        storageArea: sessionStorage,
      })
    );
    expect(storage.getTotalGamesPlayed()).toBe(before);

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: 'unrelated-key',
        newValue: '{}',
        storageArea: localStorage,
      })
    );
    expect(storage.getTotalGamesPlayed()).toBe(before);
  });

  it('setProfile rejects invalid sanitized profile', () => {
    expect(() =>
      storage.setProfile({
        name: 'ok',
        // missing id → sanitizeProfile returns null
        avatar: 'default',
        createdAt: 0,
        lastActiveAt: 0,
      } as never)
    ).toThrow(TypeError);
  });
});
