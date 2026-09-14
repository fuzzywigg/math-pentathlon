/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format game-start-first-1', () => {

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


  it('selects game-start-first-1 on first play and substitutes gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'game-start-first-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:start', {
      gameName: 'Kwatro',
      gamesPlayedThisGame: 0,
    });
    expect(msg!.id).toBe('game-start-first-1');
    expect(msg!.text).toBe(
      'Your first time playing Kwatro! Take your time and have fun learning!'
    );
  });

});
