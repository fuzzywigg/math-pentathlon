/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format game-start-first-2', () => {

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

  it('selects game-start-first-2 on first play and substitutes gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'game-start-first-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:start', { gameName: 'Contig', gamesPlayedThisGame: 0 });
    expect(msg!.id).toBe('game-start-first-2');
    expect(msg!.text).toBe(
      "Ooh, Contig! This is a great one. Don't worry about winning - just explore!"
    );
  });

});
