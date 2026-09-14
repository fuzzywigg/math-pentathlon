/**
 * Wave 30 — storage profile create/set/updateLastActive edges.
 * Deepens beyond thin wave 23 storage smoke. Distinct from hex (#148) and
 * attributes (#149). Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-profile — createProfile fields', () => {
  it('assigns unique ids across sequential creates after reset', () => {
    const a = storage.createProfile('Ada', 'owl');
    storage.resetAll();
    const b = storage.createProfile('Bo', 'star');
    expect(a.id).not.toBe(b.id);
    expect(a.name).toBe('Ada');
    expect(b.name).toBe('Bo');
    expect(storage.getProfile()?.name).toBe('Bo');
  });

  it('createdAt and lastActiveAt are set near system time', () => {
    vi.setSystemTime(new Date('2026-09-14T01:00:00Z'));
    const p = storage.createProfile('Clock', 'c');
    expect(p.createdAt).toBe(Date.now());
    expect(p.lastActiveAt).toBe(Date.now());
  });

  it('createProfile overwrites a prior profile', () => {
    storage.createProfile('First', 'a');
    const second = storage.createProfile('Second', 'b');
    expect(storage.getProfile()).toEqual(second);
    expect(storage.getProfile()?.avatar).toBe('b');
  });

  it('empty-string name and avatar are preserved as-is', () => {
    const p = storage.createProfile('', '');
    expect(p.name).toBe('');
    expect(p.avatar).toBe('');
    expect(storage.getProfile()?.name).toBe('');
  });
});

describe('Wave 30 storage-profile — setProfile round-trips', () => {
  const profiles = [
    {
      id: 'p-1',
      name: 'One',
      avatar: 'α',
      createdAt: 100,
      lastActiveAt: 200,
    },
    {
      id: 'p-2',
      name: 'Two',
      avatar: 'β',
      createdAt: 300,
      lastActiveAt: 400,
    },
    {
      id: 'p-unicode',
      name: '名前',
      avatar: '🦉',
      createdAt: 1,
      lastActiveAt: 2,
    },
  ];

  it.each(profiles)('setProfile preserves $id verbatim', (profile) => {
    storage.setProfile(profile);
    expect(storage.getProfile()).toEqual(profile);
  });

  it('setProfile then saveNow writes profile into localStorage JSON', () => {
    storage.setProfile(profiles[0]);
    storage.saveNow();
    const raw = localStorage.getItem('math-pentathlon-progress');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.profile).toEqual(profiles[0]);
  });

  it('getProfile returns null after resetAll', () => {
    storage.setProfile(profiles[1]);
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
  });
});

describe('Wave 30 storage-profile — updateLastActive', () => {
  it('no-ops when profile is null', () => {
    expect(storage.getProfile()).toBeNull();
    storage.updateLastActive();
    expect(storage.getProfile()).toBeNull();
  });

  it('advances lastActiveAt when clock moves forward', () => {
    vi.setSystemTime(new Date('2026-09-14T10:00:00Z'));
    storage.createProfile('Active', 'a');
    const before = storage.getProfile()!.lastActiveAt;

    vi.setSystemTime(new Date('2026-09-14T10:05:00Z'));
    storage.updateLastActive();
    const after = storage.getProfile()!.lastActiveAt;
    expect(after).toBe(before + 5 * 60 * 1000);
    expect(storage.getProfile()!.createdAt).toBe(before);
  });

  it('repeated updateLastActive at same clock is idempotent on timestamp', () => {
    vi.setSystemTime(new Date('2026-09-14T11:00:00Z'));
    storage.createProfile('Same', 's');
    storage.updateLastActive();
    const t1 = storage.getProfile()!.lastActiveAt;
    storage.updateLastActive();
    expect(storage.getProfile()!.lastActiveAt).toBe(t1);
  });
});

describe('Wave 30 storage-profile — isolation from other domains', () => {
  it('createProfile does not clear achievements or settings', () => {
    storage.unlockAchievement('keep-me');
    storage.updateSettings({ soundEnabled: false });
    storage.createProfile('Keeper', 'k');
    expect(storage.hasAchievement('keep-me')).toBe(true);
    expect(storage.getSettings().soundEnabled).toBe(false);
  });

  it('resetAll clears profile and achievements together', () => {
    storage.createProfile('Gone', 'g');
    storage.unlockAchievement('x');
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getAchievements()).toEqual([]);
  });
});
