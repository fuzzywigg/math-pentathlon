/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format milestone-games-100', () => {

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


  it('selects milestone-games-100 when others are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('milestone:reached')) {
      if (m.id !== 'milestone-games-100') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('milestone:reached', {});
    expect(msg!.id).toBe('milestone-games-100');
    expect(msg!.text).toBe('100 GAMES! You are a Math Pentathlon LEGEND!');
  });

});
