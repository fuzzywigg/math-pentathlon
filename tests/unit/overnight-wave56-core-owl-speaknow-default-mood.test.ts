/**
 * Overnight HEAVY leftover after #256 — speakNow default mood is thinking.
 * Distinct from wave53 speakNow default cap / wave55 hide. Tests-only.
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

describe('Wave 56 core owl — speakNow default mood', () => {
  it('omitted mood argument stamps thinking', () => {
    owlSystem.speakNow('Wave56 default mood line');
    const state = owlSystem.getState();
    expect(state.isVisible).toBe(true);
    expect(state.mood).toBe('thinking');
    expect(state.message?.text).toBe('Wave56 default mood line');
  });
});
