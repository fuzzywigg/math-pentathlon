/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl format path for win-generic-3.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 63 core owl — format win-generic-3', () => {
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

  it('selects win-generic-3 when higher-priority wins are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'win-generic-3') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gamesPlayedThisGame: 4,
      winStreak: 1,
    });
    expect(msg!.id).toBe('win-generic-3');
    expect(msg!.text).toBe(
      'Amazing! Your math brain is really showing off today!'
    );
  });
});
