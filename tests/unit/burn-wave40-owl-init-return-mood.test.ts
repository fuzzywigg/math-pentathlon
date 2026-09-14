/**
 * Wave 40 — owl init return-visit moods from lastActiveAt leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage, type OwlMood } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  storage.updateSettings({ owlEnabled: true });
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

function stampLastActiveDaysAgo(days: number): void {
  const profile = storage.createProfile('Returner', 'owl');
  storage.setProfile({
    ...profile,
    lastActiveAt: Date.now() - days * 24 * 60 * 60 * 1000,
  });
}

describe('Wave 40 owl-system — return visit moods', () => {
  it('>7 days stamps sleepy before app:return mood overwrite', () => {
    vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
    stampLastActiveDaysAgo(8);
    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.initialize();
    expect(types).toContain('app:return');
    expect(moods[0]).toBe('sleepy');
    unsub();
  });

  it('>2 and ≤7 days stamps encouraging first', () => {
    vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
    stampLastActiveDaysAgo(3);
    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    owlSystem.initialize();
    expect(moods[0]).toBe('encouraging');
  });

  it('≤2 days stamps happy first and shows after delay', () => {
    vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
    stampLastActiveDaysAgo(1);
    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    owlSystem.initialize();
    expect(moods[0]).toBe('happy');
    expect(owlSystem.getState().isVisible).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(owlSystem.getState().isVisible).toBe(true);
  });

  it('app:return carries daysSinceLastVisit from lastActiveAt', () => {
    vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
    stampLastActiveDaysAgo(5);
    let days = -1;
    const unsub = owlSystem.getEvents().on('app:return', (e) => {
      if (e.type === 'app:return') days = e.daysSinceLastVisit;
    });
    owlSystem.initialize();
    expect(days).toBe(5);
    unsub();
  });
});
