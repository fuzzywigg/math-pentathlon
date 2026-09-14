/**
 * Overnight HEAVY leftover after #250 — hide() wipes speakNow bubble + visibility.
 * Distinct from dismissMessage-only and wave23 empty hide. Tests-only.
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

describe('Wave 55 core owl — hide clears speakNow', () => {
  it('hide after speakNow drops message while leaving mood stamp', () => {
    owlSystem.speakNow('Inspect leftover hide', 'proud');
    expect(owlSystem.getState().isVisible).toBe(true);
    expect(owlSystem.getState().message?.text).toBe('Inspect leftover hide');
    owlSystem.hide();
    expect(owlSystem.getState().isVisible).toBe(false);
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().mood).toBe('proud');
  });
});
