/**
 * Overnight HEAVY leftover after #274 — onStateChange unsubscribe stops updates.
 * Distinct from wave56/57 emitter leftovers; zero wave56/57 onStateChange. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

afterEach(() => {
  owlSystem.hide();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 58 core owl — onStateChange unsub', () => {
  it('unsubscribe prevents further speakNow notifications', () => {
    const moods: string[] = [];
    const unsub = owlSystem.onStateChange((s) => moods.push(s.mood));
    const baseline = moods.length;
    owlSystem.speakNow('before unsub', 'happy');
    expect(moods.length).toBeGreaterThan(baseline);
    unsub();
    const after = moods.length;
    owlSystem.speakNow('after unsub', 'curious');
    expect(moods.length).toBe(after);
  });
});
