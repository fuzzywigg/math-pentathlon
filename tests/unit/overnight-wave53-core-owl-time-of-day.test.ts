/**
 * Overnight HEAVY leftover after #241 — getTimeOfDay buckets via app:return copy.
 * Distinct from wave40 days-since mood and wave52 select all-seen. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

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
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

function returningProfile(): void {
  const profile = storage.createProfile('Casey', 'owl');
  storage.setProfile({
    ...profile,
    lastActiveAt: Date.now() - 24 * 60 * 60 * 1000,
  });
}

describe('Wave 53 core owl — time of day buckets', () => {
  it.each([
    { hour: 6, hint: /good morning/i },
    { hour: 13, hint: /good afternoon/i },
    { hour: 18, hint: /evening owl/i },
    { hour: 22, hint: /night owl|late night/i },
  ])('local hour $hour selects matching return line', async ({ hour, hint }) => {
    vi.setSystemTime(new Date(2026, 8, 14, hour, 0, 0));
    returningProfile();
    owlSystem.initialize();
    await vi.advanceTimersByTimeAsync(50);
    const text = owlSystem.getState().message?.text ?? '';
    expect(text).toMatch(hint);
  });
});
