/**
 * q-mp-420 — characterize residual soft-fail edges in `src/core/storage/storage.ts`
 * after tip post865 cut. Targets live coverage holes on the 7-hit no-console host:
 * subscribed cross-tab dispatch (L52), localStorage-access catch in the area guard
 * (L75), and constructor `load()` outer catch (L141–142).
 *
 * Tests (+ vitest isolated listing) only. No `src/` edits. Structural asserts —
 * no player-facing copy pins, no AI / scoring / rules paths. No network.
 * Isolated project — uses `vi.resetModules` for constructor load().
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withThrowingLocalStorageAccess } from '../helpers/storage-stubs';
import { resetSettingsFlagsForTests } from '../../src/core/settings-flags';
import type * as MigrateModule from '../../src/core/storage/migrate';
import type * as SafeWebStorageModule from '../../src/core/safe-web-storage';
import type * as StorageBarrel from '../../src/core/storage';
import {
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
  createDefaultProgress,
  type ProgressData,
} from '../../src/core/storage/types';

const PROGRESS_STORAGE_KEY = 'math-pentathlon-progress';

type StorageModule = typeof StorageBarrel;

async function loadFreshStorage(): Promise<StorageModule['storage']> {
  vi.resetModules();
  resetSettingsFlagsForTests();
  const mod = (await import('../../src/core/storage')) as StorageModule;
  return mod.storage;
}

function peerProgress(overrides: Partial<ProgressData> = {}): ProgressData {
  const base = createDefaultProgress();
  return {
    ...base,
    version: CURRENT_DATA_VERSION,
    profile: {
      id: 'peer-420',
      name: 'Peer420',
      avatar: 'owl',
      createdAt: 1,
      lastActiveAt: 2,
    },
    settings: {
      ...base.settings,
      soundEnabled: false,
      reducedMotion: true,
    },
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  resetSettingsFlagsForTests();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  resetSettingsFlagsForTests();
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock('../../src/core/storage/migrate');
  vi.doUnmock('../../src/core/safe-web-storage');
});

describe('q-mp-420 storage soft-fail residuals — cross-tab subscribe path', () => {
  it('window storage event adopts peer write via subscribed handler (L52)', async () => {
    const storage = await loadFreshStorage();
    storage.createProfile('Local420', 'l');
    expect(storage.getProfile()?.name).toBe('Local420');

    const peer = peerProgress();
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify(peer),
        oldValue: null,
        storageArea: localStorage,
      })
    );

    expect(storage.getProfile()?.name).toBe('Peer420');
    expect(storage.getSettings().soundEnabled).toBe(false);
    expect(storage.getSettings().reducedMotion).toBe(true);
    storage.disposeForTests();
  });

  it('unrelated key via subscribed handler leaves in-memory session intact', async () => {
    const storage = await loadFreshStorage();
    storage.unlockAchievement('q420-keep');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'not-progress-key',
        newValue: JSON.stringify(peerProgress()),
        storageArea: localStorage,
      })
    );
    expect(storage.hasAchievement('q420-keep')).toBe(true);
    storage.disposeForTests();
  });
});

describe('q-mp-420 storage soft-fail residuals — area-guard localStorage catch', () => {
  it('blocked localStorage access during area check keeps session (L75)', async () => {
    const storage = await loadFreshStorage();
    storage.createProfile('KeepBlocked', 'k');
    storage.unlockAchievement('q420-blocked');
    const area = localStorage;

    await withThrowingLocalStorageAccess(async () => {
      expect(() => {
        storage.handleExternalStorageEvent(
          new StorageEvent('storage', {
            key: PROGRESS_STORAGE_KEY,
            newValue: JSON.stringify(peerProgress()),
            storageArea: area,
          })
        );
      }).not.toThrow();
    });

    expect(storage.getProfile()?.name).toBe('KeepBlocked');
    expect(storage.hasAchievement('q420-blocked')).toBe(true);
    storage.disposeForTests();
  });
});

describe('q-mp-420 storage soft-fail residuals — load() outer catch', () => {
  it('normalizeLoadedProgress throw → fresh defaults + warn (L141–142)', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(peerProgress()));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.resetModules();
    resetSettingsFlagsForTests();
    vi.doMock('../../src/core/storage/migrate', async (importOriginal) => {
      const actual = await importOriginal<typeof MigrateModule>();
      return {
        ...actual,
        normalizeLoadedProgress: () => {
          throw new Error('q-mp-420 normalize boom');
        },
      };
    });

    const mod = (await import('../../src/core/storage')) as StorageModule;
    expect(mod.storage.getProfile()).toBeNull();
    expect(mod.storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(warn).toHaveBeenCalled();
    mod.storage.disposeForTests();
  });

  it('safeGetItemResult throw → fresh defaults + warn (L141–142 belt)', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(peerProgress()));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.resetModules();
    resetSettingsFlagsForTests();
    vi.doMock('../../src/core/safe-web-storage', async (importOriginal) => {
      const actual = await importOriginal<typeof SafeWebStorageModule>();
      return {
        ...actual,
        safeGetItemResult: () => {
          throw new Error('q-mp-420 getItem boom');
        },
      };
    });

    const mod = (await import('../../src/core/storage')) as StorageModule;
    expect(mod.storage.getProfile()).toBeNull();
    expect(mod.storage.getAchievements()).toEqual([]);
    expect(warn).toHaveBeenCalled();
    // Writes still soft-fail through mocked helpers — memory path stays live.
    expect(() => {
      mod.storage.createProfile('AfterCatch', 'a');
    }).not.toThrow();
    expect(mod.storage.getProfile()?.name).toBe('AfterCatch');
    mod.storage.disposeForTests();
  });
});

describe('q-mp-420 storage soft-fail residuals — save console.error belt', () => {
  it('debounced save + saveNow both log without throwing when setItem fails', async () => {
    const storage = await loadFreshStorage();
    storage.createProfile('Quota420', 'q');
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    storage.updateSettings({ soundEnabled: false });
    expect(() => vi.advanceTimersByTime(200)).not.toThrow();
    expect(() => storage.saveNow()).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
    expect(storage.getProfile()?.name).toBe('Quota420');
    expect(storage.getSettings().soundEnabled).toBe(false);
    storage.disposeForTests();
  });
});
