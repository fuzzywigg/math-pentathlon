/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl formatMessage this game default.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 60 core owl — format default this game', () => {
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

  it('missing gameName formats stock template as this game', () => {
    for (const m of owlMessages.getMessagesByCategory('tutorial:start')) {
      if (m.id !== 'tutorial-start-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('tutorial:start', {});
    expect(msg!.id).toBe('tutorial-start-2');
    expect(msg!.text).toBe(
      "Learning mode activated! Let's discover how to play this game together!"
    );
  });
});
