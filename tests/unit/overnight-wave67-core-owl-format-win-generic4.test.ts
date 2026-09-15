/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format win-generic-4', () => {

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

  it('selects win-generic-4 when higher-priority wins are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'win-generic-4') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', { playerWon: true, gamesPlayedThisGame: 4, winStreak: 1 });
    expect(msg!.id).toBe('win-generic-4');
    expect(msg!.text).toBe(
      'Brilliant moves! I knew you had it in you!'
    );
  });

});
