/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl format path for game-start-generic-1.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 63 core owl — format game-start-generic-1', () => {
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

  it('selects game-start-generic-1 and substitutes gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'game-start-generic-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:start', {
      gameName: 'Hex',
      gamesPlayedThisGame: 1,
    });
    expect(msg!.id).toBe('game-start-generic-1');
    expect(msg!.text).toBe(
      'Hex - excellent choice! Show me what you can do!'
    );
  });
});
