/**
 * Wave 30 — storage profile create/set/get/updateLastActive edges.
 * Distinct from wave23 thin profile smoke and wave19 game-state serialize.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

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

describe('Wave 30 storage-profile — createProfile', () => {
  it('creates unique ids for successive profiles', () => {
    const a = storage.createProfile('Ada', 'owl');
    const b = storage.createProfile('Bo', 'star');
    expect(a.id).not.toBe(b.id);
    expect(storage.getProfile()?.name).toBe('Bo');
    expect(storage.getProfile()?.avatar).toBe('star');
  });

  it('stamps createdAt and lastActiveAt to the same clock', () => {
    vi.setSystemTime(new Date('2026-09-14T01:00:00Z'));
    const p = storage.createProfile('Clock', 'c');
    expect(p.createdAt).toBe(Date.parse('2026-09-14T01:00:00Z'));
    expect(p.lastActiveAt).toBe(p.createdAt);
  });

  it('accepts empty-string name/avatar without throwing', () => {
    const p = storage.createProfile('', '');
    expect(p.name).toBe('');
    expect(p.avatar).toBe('');
    expect(storage.getProfile()).toEqual(p);
  });
});

describe('Wave 30 storage-profile — setProfile overwrite', () => {
  it('setProfile replaces createProfile wholesale', () => {
    storage.createProfile('Temp', 't');
    storage.setProfile({
      id: 'fixed-id',
      name: 'Fixed',
      avatar: 'fx',
      createdAt: 10,
      lastActiveAt: 20,
    });
    expect(storage.getProfile()).toEqual({
      id: 'fixed-id',
      name: 'Fixed',
      avatar: 'fx',
      createdAt: 10,
      lastActiveAt: 20,
    });
  });

  it('getProfile returns the live profile object reference', () => {
    storage.setProfile({
      id: 'p1',
      name: 'Live',
      avatar: 'a',
      createdAt: 1,
      lastActiveAt: 1,
    });
    const first = storage.getProfile();
    const second = storage.getProfile();
    expect(first).toBe(second);
    expect(first?.name).toBe('Live');
  });
});

describe('Wave 30 storage-profile — updateLastActive', () => {
  it('no-ops when profile is null', () => {
    expect(storage.getProfile()).toBeNull();
    storage.updateLastActive();
    expect(storage.getProfile()).toBeNull();
  });

  it('advances lastActiveAt when clock moves forward', () => {
    vi.setSystemTime(new Date('2026-09-14T02:00:00Z'));
    storage.createProfile('Active', 'a');
    const before = storage.getProfile()!.lastActiveAt;
    vi.setSystemTime(new Date('2026-09-14T02:05:00Z'));
    storage.updateLastActive();
    expect(storage.getProfile()!.lastActiveAt).toBe(
      Date.parse('2026-09-14T02:05:00Z')
    );
    expect(storage.getProfile()!.lastActiveAt).toBeGreaterThan(before);
    expect(storage.getProfile()!.createdAt).toBe(before);
  });

  it('preserves id/name/avatar across updateLastActive', () => {
    storage.setProfile({
      id: 'keep',
      name: 'Keep',
      avatar: 'k',
      createdAt: 100,
      lastActiveAt: 100,
    });
    vi.setSystemTime(new Date('2026-09-14T03:00:00Z'));
    storage.updateLastActive();
    const p = storage.getProfile()!;
    expect(p.id).toBe('keep');
    expect(p.name).toBe('Keep');
    expect(p.avatar).toBe('k');
    expect(p.createdAt).toBe(100);
  });
});
