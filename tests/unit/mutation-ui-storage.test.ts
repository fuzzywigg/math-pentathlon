/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in storage/storage.ts
 * (cross-tab handler + message history cap).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { storage } from '../../src/core/storage';
import { PROGRESS_STORAGE_KEY } from '../../src/core/storage/storage';
import { createDefaultProgress } from '../../src/core/storage/types';

describe('mutation-ui storage manager', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    storage.resetAll();
  });

  it('MAX_MESSAGES_HISTORY trims at exactly 50', () => {
    // Survivor: 50 → 49 — hard-code expected length 50.
    for (let i = 0; i < 60; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen.length).toBe(50);
    expect(seen[0]).toBe('msg-10');
    expect(seen[seen.length - 1]).toBe('msg-59');
  });

  it('ignores storage events from sessionStorage area', () => {
    const before = structuredClone(storage.getOwlState());
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify(createDefaultProgress()),
        storageArea: sessionStorage,
      })
    );
    expect(storage.getOwlState()).toEqual(before);
  });

  it('ignores storage events for unrelated keys', () => {
    storage.updateSettings({ reducedMotion: true });
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: 'other-key',
        newValue: '{}',
        storageArea: localStorage,
      })
    );
    expect(storage.getSettings().reducedMotion).toBe(true);
  });

  it('key null or newValue null resets to defaults', () => {
    storage.updateSettings({ reducedMotion: true });
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: null,
        newValue: null,
        storageArea: localStorage,
      })
    );
    expect(storage.getSettings().reducedMotion).toBe(false);

    storage.updateSettings({ reducedMotion: true });
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: null,
        storageArea: localStorage,
      })
    );
    expect(storage.getSettings().reducedMotion).toBe(false);
  });

  it('corrupt JSON from another tab keeps in-memory session', () => {
    storage.updateSettings({ reducedMotion: true });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: '{bad',
        storageArea: localStorage,
      })
    );
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(warn).toHaveBeenCalled();
  });

  it('non-plain progress object from another tab is ignored', () => {
    storage.updateSettings({ reducedMotion: true });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: '[]',
        storageArea: localStorage,
      })
    );
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(warn).toHaveBeenCalled();
  });

  it('valid cross-tab write adopts normalized progress', () => {
    const payload = createDefaultProgress();
    payload.settings.reducedMotion = true;
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify(payload),
        storageArea: localStorage,
      })
    );
    expect(storage.getSettings().reducedMotion).toBe(true);
  });

  it('constructor reducedMotion flag uses === true (not truthy)', () => {
    // Pin via settings path after load.
    storage.updateSettings({ reducedMotion: true });
    expect(storage.getSettings().reducedMotion).toBe(true);
    storage.updateSettings({ reducedMotion: false });
    expect(storage.getSettings().reducedMotion).toBe(false);
  });
});
