/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format streak-week-1', () => {

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


  it('selects streak-week-1 at exact day-7', () => {
    for (const m of owlMessages.getMessagesByCategory('streak:update')) {
      if (m.id !== 'streak-week-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:update', {
      currentStreak: 7,
    });
    expect(msg!.id).toBe('streak-week-1');
    expect(msg!.text).toBe(
      'ONE WEEK STREAK! 7 days of math practice! Incredible dedication!'
    );
  });

});
