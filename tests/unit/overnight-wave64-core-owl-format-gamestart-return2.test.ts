/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format game-start-return-2', () => {

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


  it('selects game-start-return-2 at gamesPlayed gte-3 and formats gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'game-start-return-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:start', {
      gameName: 'Calla',
      gamesPlayedThisGame: 3,
    });
    expect(msg!.id).toBe('game-start-return-2');
    expect(msg!.text).toBe(
      "Back for more Calla? You're getting really good at this!"
    );
  });

});
