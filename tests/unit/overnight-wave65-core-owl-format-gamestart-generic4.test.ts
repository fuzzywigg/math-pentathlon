/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Owl MESSAGE_LIBRARY format residual.
 * Distinct from open #314 wave64 format slice; lock unsaturated select leftovers. Tests-only.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 65 core owl — format game-start-generic-4', () => {
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

  it('selects game-start-generic-4 when first/return msgs are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'game-start-generic-4') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:start', { gamesPlayedThisGame: 1 });
    expect(msg!.id).toBe('game-start-generic-4');
    expect(msg!.text).toBe(
      'Game time! Remember: mathematicians make mistakes, then learn from them!'
    );
  });
});
