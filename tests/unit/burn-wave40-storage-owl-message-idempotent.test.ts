/**
 * Wave 40 — markMessageSeen / hasSeenMessage / updateLastActive leftovers after #176.
 * Distinct from wave39 tutorial. Tests-only.
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

describe('Wave 40 storage — owl message / lastActive', () => {
  it('message seen is idempotent', () => {
    expect(storage.hasSeenMessage('tip-1')).toBe(false);
    storage.markMessageSeen('tip-1');
    storage.markMessageSeen('tip-1');
    expect(storage.hasSeenMessage('tip-1')).toBe(true);
  });

  it('updateLastActive stamps profile', () => {
    storage.createProfile('p', 'a');
    vi.setSystemTime(new Date('2026-09-14T13:00:00Z'));
    storage.updateLastActive();
    expect(storage.getProfile()?.lastActiveAt).toBe(
      new Date('2026-09-14T13:00:00Z').getTime()
    );
  });
});
