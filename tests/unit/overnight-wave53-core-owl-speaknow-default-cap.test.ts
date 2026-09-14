/**
 * Overnight HEAVY leftover after #241 — speakNow default mood + length-cap display.
 * Distinct from wave23/40 explicit-mood speakNow. Tests-only.
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
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 53 core owl — speakNow default mood / length cap', () => {
  it('omitted mood defaults to thinking', () => {
    owlSystem.speakNow('Default mood leftover');
    expect(owlSystem.getState().mood).toBe('thinking');
    expect(owlSystem.getState().message?.category).toBe('game:move');
  });

  it('very long copy still auto-dismisses (length bonus capped at 3000)', async () => {
    owlSystem.speakNow('x'.repeat(400), 'happy');
    // base 5000 + 3000 cap * priority 1.5 = 12000; generous buffer
    await vi.advanceTimersByTimeAsync(11_000);
    expect(owlSystem.getState().message).toBeTruthy();
    await vi.advanceTimersByTimeAsync(3_000);
    expect(owlSystem.getState().message).toBeNull();
  });
});
