/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format loss-encouraging-3', () => {

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

  it('selects loss-encouraging-3 when other losses are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'loss-encouraging-3') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', { playerWon: false });
    expect(msg!.id).toBe('loss-encouraging-3');
    expect(msg!.text).toBe(
      "The best mathematicians learn the most from challenges. You've got this!"
    );
  });

});
