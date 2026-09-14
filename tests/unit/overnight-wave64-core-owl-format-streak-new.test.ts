/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format streak-new-1', () => {

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


  it('selects streak-new-1 at exact day-2 and formats currentStreak', () => {
    for (const m of owlMessages.getMessagesByCategory('streak:update')) {
      if (m.id !== 'streak-new-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:update', {
      currentStreak: 2,
    });
    expect(msg!.id).toBe('streak-new-1');
    expect(msg!.text).toBe(
      "Day 2 of your practice streak! You're building great habits!"
    );
  });

});
