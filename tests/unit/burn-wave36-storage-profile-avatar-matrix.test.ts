/**
 * Wave 36 — storage profile create/set avatar matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type PlayerProfile } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(2_000_000_000_000);
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-profile — createProfile matrix', () => {
  const avatars = ['owl', 'fox', 'bear', 'cat', 'star', ''];

  it.each(avatars)('createProfile with avatar=%j', (avatar) => {
    storage.resetAll();
    const profile = storage.createProfile(`User-${avatar || 'empty'}`, avatar);
    expect(profile.avatar).toBe(avatar);
    expect(profile.createdAt).toBe(2_000_000_000_000);
    expect(profile.lastActiveAt).toBe(2_000_000_000_000);
    expect(profile.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(storage.getProfile()).toEqual(profile);
  });

  it('setProfile overwrites createProfile entirely', () => {
    storage.createProfile('Old', 'o');
    const next: PlayerProfile = {
      id: 'fixed-id',
      name: 'New',
      avatar: 'n',
      createdAt: 1,
      lastActiveAt: 2,
    };
    storage.setProfile(next);
    expect(storage.getProfile()).toEqual(next);
  });

  it('updateLastActive advances only lastActiveAt', () => {
    const p = storage.createProfile('Tick', 't');
    vi.setSystemTime(2_000_000_000_500);
    storage.updateLastActive();
    const after = storage.getProfile()!;
    expect(after.id).toBe(p.id);
    expect(after.name).toBe('Tick');
    expect(after.avatar).toBe('t');
    expect(after.createdAt).toBe(2_000_000_000_000);
    expect(after.lastActiveAt).toBe(2_000_000_000_500);
  });
});
