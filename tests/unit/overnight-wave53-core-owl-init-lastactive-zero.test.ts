/**
 * Overnight HEAVY leftover after #241 — lastActiveAt 0 is falsy → daysSinceLastVisit 0.
 * Distinct from wave40 return-visit 1/3/5/8 day stamps. Tests-only.
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
  owlSystem.speakNow('flush-wave53', 'happy');
  owlSystem.dismissMessage();
  owlSystem.hide();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 53 core owl — lastActiveAt zero', () => {
  it('profile with lastActiveAt 0 emits app:return days=0 and happy first', () => {
    vi.setSystemTime(new Date(2026, 8, 14, 12, 0, 0));
    const profile = storage.createProfile('ZeroActive', 'owl');
    storage.setProfile({ ...profile, lastActiveAt: 0 });

    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    let days = -1;
    const unsub = owlSystem.getEvents().on('app:return', (e) => {
      if (e.type === 'app:return') days = e.daysSinceLastVisit;
    });
    owlSystem.initialize();
    expect(days).toBe(0);
    expect(moods[0]).toBe('happy');
    expect(storage.getProfile()?.lastActiveAt).toBe(Date.now());
    unsub();
  });
});
