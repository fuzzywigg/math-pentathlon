/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format return-streak-1', () => {

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


  it('selects return-streak-1 for streak 2–6 and formats placeholders', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-streak-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', {
      currentStreak: 3,
      playerName: 'Bo',
    });
    expect(msg!.id).toBe('return-streak-1');
    expect(msg!.text).toBe("You're on a 3-day streak! Keep it going, Bo!");
  });

});
