/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 67 core owl — format draw-2', () => {

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

  it('selects draw-2 via unconditional fallback when win/loss miss', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'draw-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {});
    expect(msg!.id).toBe('draw-2');
    expect(msg!.text).toBe(
      'Tied game! That means you were evenly matched. Great job!'
    );
  });

});
