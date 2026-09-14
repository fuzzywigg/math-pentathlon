/**
 * Overnight HEAVY leftover after #234 — {achievementName} is NOT replaced by formatMessage.
 * Distinct from burn-wave40-owl-messages-placeholders. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 52 core owl — achievement placeholder', () => {
  it('stock achievement:unlock keeps literal {achievementName}', () => {
    const msg = owlMessages.selectMessage('achievement:unlock', {
      playerName: 'Ada',
      gameName: 'Hex',
    });
    expect(msg).toBeTruthy();
    expect(msg!.text).toContain('{achievementName}');
  });
});
