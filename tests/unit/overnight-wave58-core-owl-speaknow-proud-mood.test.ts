/**
 * Overnight HEAVY leftover after #274 — speakNow explicit proud mood.
 * Distinct from wave56 default thinking; wave55 hide-clears proud. Tests-only.
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

describe('Wave 58 core owl — speakNow proud mood', () => {
  it('speakNow with proud sets mood and message text', () => {
    owlSystem.speakNow('Wave58 proud leftover', 'proud');
    const state = owlSystem.getState();
    expect(state.mood).toBe('proud');
    expect(state.message?.text).toBe('Wave58 proud leftover');
    expect(state.isVisible).toBe(true);
  });
});
