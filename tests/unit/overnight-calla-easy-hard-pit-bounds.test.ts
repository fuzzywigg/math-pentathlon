/**
 * Overnight HEAVY after #214/#215 — Calla easy/hard pit bounds leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import { getAIMove } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight calla — easy/hard bounds', () => {
  it('easy and hard return pits inside valid set', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const s = createInitialState();
    const valids = getValidPits(s);
    for (const d of ['easy', 'hard'] as const) {
      const move = getAIMove(s, 'player1', d);
      expect(move).not.toBeNull();
      expect(valids).toContain(move!.pit);
    }
  }, 15_000);
});
