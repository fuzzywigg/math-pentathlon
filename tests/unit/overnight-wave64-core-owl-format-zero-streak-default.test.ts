/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format zero streak default', () => {

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


  it('missing currentStreak formats streak-record as 0 days', () => {
    for (const m of owlMessages.getMessagesByCategory('streak:update')) {
      if (m.id !== 'streak-record-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:update', {});
    expect(msg!.id).toBe('streak-record-1');
    expect(msg!.text).toBe(
      "NEW PERSONAL RECORD! 0 days! You've never gone this long before!"
    );
  });

});
