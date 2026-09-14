/**
 * Overnight HEAVY leftover after #256 — dismissMessage clears bubble but keeps
 * isVisible. Distinct from wave55 hide() wipe. Tests-only.
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

describe('Wave 56 core owl — dismiss keeps visible', () => {
  it('dismiss after speakNow drops message while isVisible stays true', () => {
    owlSystem.speakNow('Keep visible leftover', 'proud');
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.dismissMessage();
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
    expect(owlSystem.getState().isVisible).toBe(true);
    expect(owlSystem.getState().mood).toBe('proud');
  });
});
