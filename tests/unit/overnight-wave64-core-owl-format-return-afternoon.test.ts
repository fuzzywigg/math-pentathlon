/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format return-afternoon-1', () => {

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


  it('selects return-afternoon-1 and formats playerName', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-afternoon-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', {
      timeOfDay: 'afternoon',
      playerName: 'Dana',
      currentStreak: 0,
    });
    expect(msg!.id).toBe('return-afternoon-1');
    expect(msg!.text).toBe(
      'Good afternoon! Perfect time for a math challenge, Dana!'
    );
  });

});
