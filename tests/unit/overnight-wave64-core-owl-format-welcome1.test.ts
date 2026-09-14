/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format welcome-1', () => {

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


  it('selects welcome-1 on firstTime app:start when others are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:start')) {
      if (m.id !== 'welcome-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 0,
    });
    expect(msg!.id).toBe('welcome-1');
    expect(msg!.text).toBe(
      "Hoot hoot! I'm Ollie the Owl, your math adventure guide! Ready to explore some amazing games?"
    );
  });

});
