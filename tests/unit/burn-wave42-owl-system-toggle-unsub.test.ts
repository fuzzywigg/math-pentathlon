/**
 * Wave 42 — owlSystem toggle / onStateChange unsubscribe leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  storage.updateSettings({ owlEnabled: true });
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

describe('Wave 42 owl-system — toggle unsub', () => {
  it('show then toggle hides; toggle again shows', () => {
    owlSystem.show();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(false);
    expect(owlSystem.getState().message).toBeNull();
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(true);
  });

  it('onStateChange fires immediately with current state', () => {
    owlSystem.hide();
    const seen: boolean[] = [];
    const unsub = owlSystem.onStateChange((s) => seen.push(s.isVisible));
    expect(seen[0]).toBe(false);
    owlSystem.show();
    expect(seen.at(-1)).toBe(true);
    unsub();
  });

  it('unsubscribe stops further notifications', () => {
    let calls = 0;
    const unsub = owlSystem.onStateChange(() => {
      calls += 1;
    });
    const baseline = calls;
    unsub();
    owlSystem.show();
    owlSystem.hide();
    expect(calls).toBe(baseline);
  });

  it('hide clears message', () => {
    owlSystem.speakNow('temp', 'happy');
    expect(owlSystem.getState().message).toBeTruthy();
    owlSystem.hide();
    expect(owlSystem.getState().isVisible).toBe(false);
    expect(owlSystem.getState().message).toBeNull();
  });

  it('getState returns a shallow copy', () => {
    owlSystem.show();
    const a = owlSystem.getState();
    const b = owlSystem.getState();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });
});
