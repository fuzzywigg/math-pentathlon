/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format loss-encouraging-1', () => {

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


  it('selects loss-encouraging-1 when other losses are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'loss-encouraging-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: false,
    });
    expect(msg!.id).toBe('loss-encouraging-1');
    expect(msg!.text).toBe(
      'That was a tough game! Every loss teaches us something. Want another go?'
    );
  });

});
