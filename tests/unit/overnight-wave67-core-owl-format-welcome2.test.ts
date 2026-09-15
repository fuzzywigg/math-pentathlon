/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format welcome-2', () => {

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

  it('selects welcome-2 on firstTime when welcome-1/3 are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:start')) {
      if (m.id !== 'welcome-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:start', { gamesPlayedThisGame: 0 });
    expect(msg!.id).toBe('welcome-2');
    expect(msg!.text).toBe(
      "Welcome to Math Pentathlon! I'm Ollie, and I'll be cheering you on. Let's pick a game!"
    );
  });

});
