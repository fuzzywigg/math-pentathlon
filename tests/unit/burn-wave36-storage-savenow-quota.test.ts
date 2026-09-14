/**
 * Wave 36 — saveNow / debounced save QuotaExceededError swallow.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const KEY = 'math-pentathlon-progress';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-quota — setItem failures', () => {
  it('saveNow does not throw when setItem throws QuotaExceededError', () => {
    storage.createProfile('Quota', 'q');
    const err = new DOMException('quota', 'QuotaExceededError');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw err;
    });
    expect(() => storage.saveNow()).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('debounced save catches setItem errors after flush', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('boom');
    });
    storage.updateSettings({ soundEnabled: false });
    expect(() => vi.advanceTimersByTime(200)).not.toThrow();
    expect(spy).toHaveBeenCalled();
    // key may be absent after failed write
    void KEY;
  });
});
