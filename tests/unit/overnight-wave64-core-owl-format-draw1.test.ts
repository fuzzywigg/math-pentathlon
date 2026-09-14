/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format draw-1', () => {

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


  it('selects draw-1 via unconditional fallback when win/loss miss', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'draw-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {});
    expect(msg!.id).toBe('draw-1');
    expect(msg!.text).toBe(
      'A draw! Both players matched wits perfectly. Impressive!'
    );
  });

});
