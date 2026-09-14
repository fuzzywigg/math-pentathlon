/**
 * Overnight HEAVY leftover after #256 — getState returns a shallow copy.
 * Distinct from burn-wave23 visibility toggles. Tests-only.
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
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 56 core owl — getState shallow copy', () => {
  it('mutating returned state does not change next getState', () => {
    owlSystem.show();
    owlSystem.speakNow('Shallow leftover', 'happy');
    const snap = owlSystem.getState();
    snap.isVisible = false;
    snap.mood = 'sleepy';
    snap.message = null;
    const again = owlSystem.getState();
    expect(again.isVisible).toBe(true);
    expect(again.mood).toBe('happy');
    expect(again.message?.text).toBe('Shallow leftover');
  });
});
