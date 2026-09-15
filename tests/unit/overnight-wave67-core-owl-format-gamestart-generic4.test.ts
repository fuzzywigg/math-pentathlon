/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format game-start-generic-4', () => {

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

  it('selects game-start-generic-4 when first/return rows are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'game-start-generic-4') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:start', { gamesPlayedThisGame: 2 });
    expect(msg!.id).toBe('game-start-generic-4');
    expect(msg!.text).toBe(
      'Game time! Remember: mathematicians make mistakes, then learn from them!'
    );
  });

});
