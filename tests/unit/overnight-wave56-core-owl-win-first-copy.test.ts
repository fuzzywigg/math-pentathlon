/**
 * Overnight HEAVY leftover after #256 — win-first-1 stock id/copy.
 * Distinct from wave55 win-streak-1. Tests-only.
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

describe('Wave 56 core owl — win-first-1 copy', () => {
  it('first win selects win-first-1 celebration line', () => {
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gamesPlayedThisGame: 1,
      winStreak: 1,
      gameName: 'Hex',
    });
    expect(msg?.id).toBe('win-first-1');
    expect(msg?.text).toMatch(/YOU WON YOUR FIRST Hex GAME/i);
  });
});
