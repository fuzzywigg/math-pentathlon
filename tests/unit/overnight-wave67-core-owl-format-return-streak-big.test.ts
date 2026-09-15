/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format return-streak-big-1', () => {

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

  it('selects return-streak-big-1 and formats currentStreak', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-streak-big-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', { currentStreak: 9, playerName: 'Riley' });
    expect(msg!.id).toBe('return-streak-big-1');
    expect(msg!.text).toBe(
      'WOW! 9 days in a row! You are UNSTOPPABLE!'
    );
  });

});
