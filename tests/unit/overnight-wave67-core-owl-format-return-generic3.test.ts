/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format return-generic-3', () => {

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

  it('selects return-generic-3 when ToD/streak rows are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-generic-3') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', { currentStreak: 0 });
    expect(msg!.id).toBe('return-generic-3');
    expect(msg!.text).toBe(
      "Hoot! You're back! Let's make some mathematical magic happen!"
    );
  });

});
