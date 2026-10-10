/**
 * q-mp-325 mutation audit UI wave 10 — structural re-pins for safe-web-storage.
 * First-20 window already 100% at baseline; keep equality / boolean arms pinned.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getWebStorage,
  safeGetItemResult,
  safeParseJson,
  safeSetItem,
  safeSetItemResult,
  subscribeStorageEvent,
} from '../../src/core/safe-web-storage';

describe('mutation-ui10 safe-web-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('kind===local vs session selects distinct stores (kills L40 ===→!==)', () => {
    expect(getWebStorage('local')).toBe(localStorage);
    expect(getWebStorage('session')).toBe(sessionStorage);
    expect(getWebStorage('local')).not.toBe(getWebStorage('session'));
  });

  it('safeParseJson rejects null, undefined, and empty string independently', () => {
    // Three === arms on L148; each must fail closed.
    expect(safeParseJson(null).ok).toBe(false);
    expect(safeParseJson(undefined).ok).toBe(false);
    expect(safeParseJson('').ok).toBe(false);
    expect(safeParseJson('0').ok).toBe(true);
    if (safeParseJson('0').ok) {
      expect(safeParseJson('0')).toMatchObject({ ok: true, value: 0 });
    }
  });

  it('safeSetItemResult ok:true writes; ok:false when probe throws', () => {
    expect(safeSetItemResult('w10', 'v').ok).toBe(true);
    expect(localStorage.getItem('w10')).toBe('v');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(safeSetItemResult('w10b', 'v').ok).toBe(false);
    expect(safeSetItem('w10c', 'v')).toBe(false);
  });

  it('subscribeStorageEvent unsubscribe clears only matching handler identity', () => {
    const a = vi.fn();
    const b = vi.fn();
    const unA = subscribeStorageEvent(a);
    const unB = subscribeStorageEvent(b);
    unA(); // a is no longer current — must not clear b
    window.dispatchEvent(new StorageEvent('storage', { key: 'k1' }));
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledOnce();
    unB();
    window.dispatchEvent(new StorageEvent('storage', { key: 'k2' }));
    expect(b).toHaveBeenCalledOnce();
  });

  it('safeGetItemResult ok:true value null for missing key (boolean ok arm)', () => {
    const result = safeGetItemResult('missing-w10');
    expect(result).toEqual({ ok: true, value: null });
  });
});
