/**
 * q-mp-429 mutation audit UI wave 14 — kill first-20 survivors in
 * storage/storage.ts (cross-tab handler + reducedMotion === true flag sync).
 * Separate from parallel characterization q-mp-420 (*storage* soft-fail).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { storage } from '../../src/core/storage';
import { PROGRESS_STORAGE_KEY } from '../../src/core/storage/storage';
import { createDefaultProgress } from '../../src/core/storage/types';
import {
  getUserReducedMotionFlag,
  resetSettingsFlagsForTests,
} from '../../src/core/settings-flags';

describe('mutation-ui14 storage — cross-tab + settings flag', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
    storage.resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    storage.resetAll();
    resetSettingsFlagsForTests();
  });

  it('newValue null alone resets session (kills L83 || → &&)', () => {
    storage.updateSettings({ reducedMotion: true });
    expect(storage.getSettings().reducedMotion).toBe(true);

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: null,
        storageArea: localStorage,
      })
    );

    expect(storage.getSettings().reducedMotion).toBe(false);
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('key null with non-null newValue still resets (kills L83 || → &&)', () => {
    storage.updateSettings({ reducedMotion: true });

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: null,
        newValue: JSON.stringify(createDefaultProgress()),
        storageArea: localStorage,
      })
    );

    expect(storage.getSettings().reducedMotion).toBe(false);
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('clear path sets reducedMotion flag via === true (kills L85 ===/true)', () => {
    storage.updateSettings({ reducedMotion: true });
    expect(getUserReducedMotionFlag()).toBe(true);

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: null,
        newValue: null,
        storageArea: localStorage,
      })
    );

    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('adopted progress syncs reducedMotion flag via === true (kills L100)', () => {
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
    expect(getUserReducedMotionFlag()).toBe(true);

    const off = createDefaultProgress();
    off.settings.reducedMotion = false;
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify(off),
        storageArea: localStorage,
      })
    );
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('non-plain JSON keeps session (kills L90 || → && on ok/plain check)', () => {
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
    expect(getUserReducedMotionFlag()).toBe(true);
    expect(warn).toHaveBeenCalled();
  });

  it('MAX_MESSAGES_HISTORY trims at exactly 50', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`w14-msg-${i}`);
    }
    expect(storage.getOwlState().messagesSeen.length).toBe(50);
    expect(storage.getOwlState().messagesSeen[0]).toBe('w14-msg-5');
  });

  // Constructor `reducedMotion === true` (L48) and load() `!read.ok` (L108) need
  // a fresh module graph / blocked storage; resetAll/updateSettings re-sync the
  // flag via later unmutated lines, so these stay pinned (not product bugs).
  it.skip('pinned: constructor reducedMotion === true (L48) needs remount isolation', () => {
    expect(true).toBe(true);
  });

  it.skip('pinned: load() !read.ok warn path (L108) needs remount isolation', () => {
    expect(true).toBe(true);
  });
});
