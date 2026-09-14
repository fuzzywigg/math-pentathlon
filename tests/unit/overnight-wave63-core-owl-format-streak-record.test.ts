/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl format path for streak-record-1.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 63 core owl — format streak-record-1', () => {
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

  it('selects streak-record-1 fallback when conditioned rows miss', () => {
    // streak 11 matches neither eq-2 nor eq-7; falls back to unconditional record
    for (const m of owlMessages.getMessagesByCategory('streak:update')) {
      if (m.id !== 'streak-record-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:update', {
      currentStreak: 11,
    });
    expect(msg!.id).toBe('streak-record-1');
    expect(msg!.text).toBe(
      "NEW PERSONAL RECORD! 11 days! You've never gone this long before!"
    );
  });
});
