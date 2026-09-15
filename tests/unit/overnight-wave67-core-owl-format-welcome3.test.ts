/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format welcome-3', () => {

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

  it('selects welcome-3 on firstTime when welcome-1/2 are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:start')) {
      if (m.id !== 'welcome-3') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:start', { gamesPlayedThisGame: 0 });
    expect(msg!.id).toBe('welcome-3');
    expect(msg!.text).toBe(
      "Hello, young mathematician! I'm Ollie the Owl. Together we'll conquer 20 amazing math games!"
    );
  });

});
