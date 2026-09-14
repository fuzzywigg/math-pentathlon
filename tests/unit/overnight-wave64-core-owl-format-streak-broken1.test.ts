/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 64 core owl — format streak-broken-1', () => {

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


  it('selects streak-broken-1 when broken-2 is seen', () => {
    for (const m of owlMessages.getMessagesByCategory('streak:broken')) {
      if (m.id !== 'streak-broken-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:broken', {});
    expect(msg!.id).toBe('streak-broken-1');
    expect(msg!.text).toBe(
      "Your streak reset, but that's okay! Today is a fresh start. Let's build a new one!"
    );
  });

});
