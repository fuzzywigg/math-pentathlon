/**
 * Isolated remount: StorageManager constructor when localStorage access throws.
 * Uses vi.resetModules — listed in vitest.config isolatedFiles.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { withThrowingLocalStorageAccess } from '../helpers/storage-stubs';

describe('safe-web-storage remount — SecurityError on localStorage access', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('StorageManager starts from defaults when localStorage getter throws', async () => {
    await withThrowingLocalStorageAccess(async () => {
      vi.resetModules();
      const mod = await import('../../src/core/storage/storage');
      expect(mod.storage.getProfile()).toBeNull();
      expect(mod.storage.getSettings().soundEnabled).toBe(true);
      expect(() => {
        mod.storage.createProfile('Soft', 's');
        mod.storage.saveNow();
      }).not.toThrow();
      expect(mod.storage.getProfile()?.name).toBe('Soft');
      mod.storage.disposeForTests();
    });
  });
});
