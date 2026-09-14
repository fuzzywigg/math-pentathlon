/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Owl MESSAGE_LIBRARY format residual.
 * Distinct from open #314 wave64 format slice; lock unsaturated select leftovers. Tests-only.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 65 core owl — format win-generic-1', () => {
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

  it('selects win-generic-1 when other wins are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'win-generic-1') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', { playerWon: true, gamesPlayedThisGame: 4, winStreak: 1 });
    expect(msg!.id).toBe('win-generic-1');
    expect(msg!.text).toBe(
      'VICTORY! Your strategic thinking really paid off!'
    );
  });
});
