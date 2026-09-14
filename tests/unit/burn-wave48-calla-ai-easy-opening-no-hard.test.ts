/**
 * Wave 48 — Calla easy/medium opening move only (no hard depth-6). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove, isAITurn } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 calla — AI easy/medium opening', () => {
  it('easy and medium return legal pit on opening; hard skipped', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    for (const d of ['easy', 'medium'] as const) {
      const move = getAIMove(s, 'player1', d);
      expect(move).not.toBeNull();
      expect(move!.pit).toBeGreaterThanOrEqual(0);
      expect(move!.pit).toBeLessThan(5);
    }
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
  });
});
