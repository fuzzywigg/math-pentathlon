/**
 * Safe Web Storage wrapper — stubs each failure mode the burn-1008 audit covers:
 * SecurityError (storage disabled), QuotaExceededError on write, mid-session clear
 * via storage events, cross-tab writes, and non-JSON garbage.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  getWebStorage,
  safeGetItem,
  safeParseJson,
  safeRemoveItem,
  safeSetItem,
  safeSetItemResult,
  subscribeStorageEvent,
} from '../../src/core/safe-web-storage';
import { isBoard3dEnabled } from '../../src/core/feature-flags';
import {
  getUserReducedMotionFlag,
  resetSettingsFlagsForTests,
} from '../../src/core/settings-flags';
import { PROGRESS_STORAGE_KEY, storage } from '../../src/core/storage';
import {
  isBoard3dLowQuality,
  shouldPreserveDrawingBuffer,
} from '../../src/ui/three/tablet-gl';

function securityError(message = 'blocked'): DOMException {
  return new DOMException(message, 'SecurityError');
}

function quotaError(message = 'quota'): DOMException {
  return new DOMException(message, 'QuotaExceededError');
}

describe('safe-web-storage primitives', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('getWebStorage returns localStorage when readable', () => {
    expect(getWebStorage('local')).toBe(localStorage);
    expect(getWebStorage('session')).toBe(sessionStorage);
  });

  it('getWebStorage returns null when getItem throws SecurityError', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError();
    });
    expect(getWebStorage('local')).toBeNull();
    expect(getWebStorage('session')).toBeNull();
  });

  it('getWebStorage returns null when accessing localStorage throws', () => {
    const original = Object.getOwnPropertyDescriptor(
      globalThis,
      'localStorage'
    );
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw securityError('Safari private');
      },
    });
    try {
      expect(getWebStorage('local')).toBeNull();
    } finally {
      if (original) {
        Object.defineProperty(globalThis, 'localStorage', original);
      }
    }
  });

  it('safeGetItem returns null on SecurityError instead of throwing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError();
    });
    expect(() => safeGetItem('any')).not.toThrow();
    expect(safeGetItem('any')).toBeNull();
  });

  it('safeSetItemResult reports QuotaExceededError without throwing', () => {
    const err = quotaError();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw err;
    });
    const result = safeSetItemResult('k', 'v');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(err);
    }
    expect(safeSetItem('k', 'v')).toBe(false);
  });

  it('safeSetItemResult reports SecurityError when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError();
    });
    const result = safeSetItemResult('k', 'v');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect((result.error as DOMException).name).toBe('SecurityError');
    }
  });

  it('safeRemoveItem fails soft on SecurityError', () => {
    localStorage.setItem('x', '1');
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw securityError();
    });
    expect(safeRemoveItem('x')).toBe(false);
  });

  it('safeParseJson handles null, empty, and non-JSON garbage', () => {
    expect(safeParseJson(null).ok).toBe(false);
    expect(safeParseJson('').ok).toBe(false);
    expect(safeParseJson('{not-json').ok).toBe(false);
    expect(safeParseJson('undefined').ok).toBe(false);
    const good = safeParseJson('{"a":1}');
    expect(good.ok).toBe(true);
    if (good.ok) expect(good.value).toEqual({ a: 1 });
  });

  it('subscribeStorageEvent delivers other-tab events and unsubscribes', () => {
    const seen: StorageEvent[] = [];
    const unsub = subscribeStorageEvent((e) => {
      seen.push(e);
    });
    const event = new StorageEvent('storage', {
      key: 'k',
      newValue: 'v',
      oldValue: null,
      storageArea: localStorage,
    });
    window.dispatchEvent(event);
    expect(seen).toHaveLength(1);
    expect(seen[0]?.key).toBe('k');
    unsub();
    window.dispatchEvent(event);
    expect(seen).toHaveLength(1);
  });
});

describe('call-site routing — feature / settings / tablet flags', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  it('isBoard3dEnabled() with no args fails soft when localStorage access throws', () => {
    const original = Object.getOwnPropertyDescriptor(
      globalThis,
      'localStorage'
    );
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw securityError('disabled');
      },
    });
    try {
      expect(() => isBoard3dEnabled()).not.toThrow();
      expect(isBoard3dEnabled()).toBe(false);
    } finally {
      if (original) {
        Object.defineProperty(globalThis, 'localStorage', original);
      }
    }
  });

  it('getUserReducedMotionFlag peeks fail soft on SecurityError and garbage JSON', () => {
    resetSettingsFlagsForTests();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError();
    });
    expect(getUserReducedMotionFlag()).toBe(false);

    vi.restoreAllMocks();
    resetSettingsFlagsForTests();
    localStorage.setItem(PROGRESS_STORAGE_KEY, '{not-json');
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('tablet-gl storage flags fail soft when getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError();
    });
    // navigator.webdriver may force preserve on; clear it for this assertion.
    const navDesc = Object.getOwnPropertyDescriptor(navigator, 'webdriver');
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      get: () => false,
    });
    try {
      expect(() => shouldPreserveDrawingBuffer()).not.toThrow();
      expect(shouldPreserveDrawingBuffer()).toBe(false);
      expect(isBoard3dLowQuality()).toBe(false);
    } finally {
      if (navDesc) {
        Object.defineProperty(navigator, 'webdriver', navDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (navigator as any).webdriver;
      }
    }
  });
});

describe('StorageManager — quota, clear mid-session, cross-tab, garbage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    storage.resetAll();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
    storage.resetAll();
  });

  it('saveNow / debounced save keep memory on QuotaExceededError', () => {
    storage.createProfile('Kid', 'k');
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw quotaError();
    });

    expect(() => storage.saveNow()).not.toThrow();
    expect(storage.getProfile()?.name).toBe('Kid');
    expect(errSpy).toHaveBeenCalled();

    storage.updateSettings({ soundEnabled: false });
    expect(() => vi.advanceTimersByTime(200)).not.toThrow();
    expect(storage.getSettings().soundEnabled).toBe(false);
  });

  it('cross-tab write via storage event adopts peer progress', () => {
    storage.createProfile('Local', 'a');
    const peer = {
      version: 1,
      profile: {
        id: 'peer',
        name: 'Peer',
        avatar: 'b',
        createdAt: 1,
        lastActiveAt: 1,
      },
      streak: {
        currentStreak: 0,
        bestStreak: 0,
        lastPlayDate: '',
        streakStartDate: '',
      },
      achievements: [],
      gameStats: {},
      owlState: {
        mood: 'happy',
        lastInteraction: 0,
        messagesSeen: [],
        tutorialsCompleted: [],
        totalMessagesShown: 0,
      },
      settings: {
        soundEnabled: true,
        reducedMotion: true,
        owlEnabled: true,
        owlFrequency: 'normal',
      },
    };

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify(peer),
        oldValue: null,
        storageArea: localStorage,
      })
    );

    expect(storage.getProfile()?.name).toBe('Peer');
    expect(storage.getSettings().reducedMotion).toBe(true);
  });

  it('cross-tab clear mid-session resets to defaults without throwing', () => {
    storage.createProfile('Gone', 'x');
    expect(() => {
      storage.handleExternalStorageEvent(
        new StorageEvent('storage', {
          key: PROGRESS_STORAGE_KEY,
          newValue: null,
          oldValue: '{}',
          storageArea: localStorage,
        })
      );
    }).not.toThrow();
    expect(storage.getProfile()).toBeNull();
  });

  it('cross-tab clear() (key=null) resets without spinning', () => {
    storage.createProfile('Cleared', 'y');
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: null,
        newValue: null,
        oldValue: null,
        storageArea: localStorage,
      })
    );
    expect(storage.getProfile()).toBeNull();
  });

  it('cross-tab non-JSON garbage keeps in-memory session', () => {
    storage.createProfile('Keep', 'z');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: '{garbage',
        oldValue: null,
        storageArea: localStorage,
      })
    );
    expect(storage.getProfile()?.name).toBe('Keep');
    expect(warn).toHaveBeenCalled();
  });

  it('unrelated storage keys are ignored', () => {
    storage.createProfile('Same', 's');
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: 'other-key',
        newValue: '{"profile":{"name":"Nope"}}',
        oldValue: null,
        storageArea: localStorage,
      })
    );
    expect(storage.getProfile()?.name).toBe('Same');
  });
});
