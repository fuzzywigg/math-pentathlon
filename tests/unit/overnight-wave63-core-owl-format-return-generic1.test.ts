/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl format path for return-generic-1.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 63 core owl — format return-generic-1', () => {
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

  it('selects return-generic-1 when other returns are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-generic-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Ada',
    });
    expect(msg!.id).toBe('return-generic-1');
    expect(msg!.text).toBe(
      'Welcome back, Ada! Which game shall we tackle today?'
    );
  });
});
