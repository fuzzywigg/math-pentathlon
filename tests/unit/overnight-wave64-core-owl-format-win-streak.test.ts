/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format win-streak-1', () => {

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


  it('selects win-streak-1 and substitutes winStreak + gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'win-streak-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: true,
      winStreak: 4,
      gamesPlayedThisGame: 6,
      gameName: 'FIAR',
    });
    expect(msg!.id).toBe('win-streak-1');
    expect(msg!.text).toBe("4 wins in a row at FIAR! You're on fire!");
  });

});
