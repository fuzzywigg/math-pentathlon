/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format streak-broken-2', () => {

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

  it('selects streak-broken-2 when streak-broken-1 is seen', () => {
    for (const m of owlMessages.getMessagesByCategory('streak:broken')) {
      if (m.id !== 'streak-broken-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:broken', {});
    expect(msg!.id).toBe('streak-broken-2');
    expect(msg!.text).toBe(
      "Missed a day? No worries! The most important thing is you're here now!"
    );
  });

});
