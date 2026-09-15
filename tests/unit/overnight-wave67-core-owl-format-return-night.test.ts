/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format return-night-1', () => {

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

  it('selects return-night-1 when streak rows are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-night-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', { timeOfDay: 'night', currentStreak: 0 });
    expect(msg!.id).toBe('return-night-1');
    expect(msg!.text).toBe(
      "Late night math session? I'm a night owl too! Let's do this!"
    );
  });

});
