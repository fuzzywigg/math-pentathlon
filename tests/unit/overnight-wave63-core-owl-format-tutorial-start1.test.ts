/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl format path for tutorial-start-1.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 63 core owl — format tutorial-start-1', () => {
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

  it('selects tutorial-start-1 and substitutes gameName', () => {
    for (const m of owlMessages.getMessagesByCategory('tutorial:start')) {
      if (m.id !== 'tutorial-start-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('tutorial:start', {
      gameName: 'Contig',
    });
    expect(msg!.id).toBe('tutorial-start-1');
    expect(msg!.text).toBe(
      "Smart choice starting with the tutorial! I'll guide you through Contig step by step."
    );
  });
});
