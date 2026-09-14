/**
 * Overnight HEAVY leftover after #264 — dismissMessage clears bubble + animating.
 * Distinct from wave55 hide clears speakNow; wave56 mood default. Tests-only.
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
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

describe('Wave 57 core owl — dismissMessage', () => {
  it('clears message and isAnimating while remaining visible', () => {
    owlSystem.speakNow('Wave57 dismiss line', 'happy');
    expect(owlSystem.getState().message?.text).toBe('Wave57 dismiss line');
    expect(owlSystem.getState().isAnimating).toBe(true);
    owlSystem.dismissMessage();
    const state = owlSystem.getState();
    expect(state.message).toBeNull();
    expect(state.isAnimating).toBe(false);
    expect(state.isVisible).toBe(true);
  });
});
