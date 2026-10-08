/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in safe-web-storage.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('mutation-ui safe-web-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('safeGetItemResult ok:true with null when key missing', () => {
    // Survivors around ok true/false and store == null branch.
    const result = safeGetItemResult('missing-key-mut');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBeNull();
  });

  it('safeGetItemResult ok:false when store is unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        return null;
      },
    });
    try {
      const result = safeGetItemResult('k');
      expect(result.ok).toBe(false);
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original);
    }
  });

  it('safeGetItemResult ok:false when getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const result = safeGetItemResult('k');
    expect(result.ok).toBe(false);
  });

  it('safeSetItemResult ok:true on success', () => {
    const result = safeSetItemResult('k', 'v');
    expect(result.ok).toBe(true);
    expect(localStorage.getItem('k')).toBe('v');
  });

  it('safeSetItemResult ok:false when getWebStorage returns null', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const result = safeSetItemResult('k', 'v');
    expect(result.ok).toBe(false);
  });

  it('safeRemoveItem returns true on success and false when store missing', () => {
    localStorage.setItem('rm', '1');
    expect(safeRemoveItem('rm')).toBe(true);
    expect(localStorage.getItem('rm')).toBeNull();

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(safeRemoveItem('rm')).toBe(false);
  });

  it('safeRemoveItem returns false when removeItem throws', () => {
    localStorage.setItem('rm2', '1');
    // getWebStorage probes getItem successfully first
    const removeSpy = vi
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {
        throw new DOMException('blocked', 'SecurityError');
      });
    expect(safeRemoveItem('rm2')).toBe(false);
    removeSpy.mockRestore();
  });

  it('safeGetItem mirrors result.ok mapping', () => {
    localStorage.setItem('sg', 'abc');
    expect(safeGetItem('sg')).toBe('abc');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(safeGetItem('sg')).toBeNull();
  });

  it('safeSetItem returns boolean from result.ok', () => {
    expect(safeSetItem('a', 'b')).toBe(true);
  });

  it('safeParseJson rejects null and empty', () => {
    expect(safeParseJson(null).ok).toBe(false);
    expect(safeParseJson('').ok).toBe(false);
    expect(safeParseJson('{"a":1}').ok).toBe(true);
  });

  it('subscribeStorageEvent is idempotent and latest handler wins', () => {
    const a = vi.fn();
    const b = vi.fn();
    const unA = subscribeStorageEvent(a);
    const unB = subscribeStorageEvent(b);
    window.dispatchEvent(new StorageEvent('storage', { key: 'x' }));
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledOnce();
    unB();
    window.dispatchEvent(new StorageEvent('storage', { key: 'y' }));
    expect(b).toHaveBeenCalledOnce();
    unA();
  });

  it('getWebStorage distinguishes local vs session', () => {
    expect(getWebStorage('local')).toBe(localStorage);
    expect(getWebStorage('session')).toBe(sessionStorage);
  });
});
