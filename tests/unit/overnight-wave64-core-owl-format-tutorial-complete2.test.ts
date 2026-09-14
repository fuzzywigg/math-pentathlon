/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format tutorial-complete-2', () => {

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


  it('selects tutorial-complete-2 and substitutes gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('tutorial:complete')) {
      if (m.id !== 'tutorial-complete-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('tutorial:complete', {
      gameName: 'Juggle',
    });
    expect(msg!.id).toBe('tutorial-complete-2');
    expect(msg!.text).toBe(
      "You've mastered the basics of Juggle! Ready for a real game?"
    );
  });

});
