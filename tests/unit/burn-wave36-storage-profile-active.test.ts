/**
 * Wave 36 — updateLastActive / profile null guards.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 36 storage-profile — lastActive', () => {
  it('updateLastActive no-ops without profile', () => {
    expect(() => storage.updateLastActive()).not.toThrow();
    expect(storage.getProfile()).toBeNull();
  });

  it('updateLastActive advances lastActiveAt', () => {
    const p = storage.createProfile('Active', 'a');
    const created = p.lastActiveAt;
    vi.setSystemTime(new Date('2026-09-14T15:00:00Z'));
    storage.updateLastActive();
    expect(storage.getProfile()!.lastActiveAt).toBeGreaterThan(created);
  });
});
