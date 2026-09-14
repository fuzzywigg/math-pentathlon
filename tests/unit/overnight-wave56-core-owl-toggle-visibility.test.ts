/**
 * Overnight HEAVY leftover after #256 — owlSystem.toggle flips visibility.
 * Distinct from wave55 hide-clears-speakNow. Tests-only.
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

describe('Wave 56 core owl — toggle visibility', () => {
  it('toggle show then hide restores isVisible false', () => {
    expect(owlSystem.getState().isVisible).toBe(false);
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(false);
  });
});
