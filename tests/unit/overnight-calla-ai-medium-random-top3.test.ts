/**
 * Overnight HEAVY after #214/#215 — Calla medium randomness branch. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import { getAIMove } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight calla — medium random', () => {
  it('low and high random return valid pits', () => {
    const s = createInitialState();
    const valids = getValidPits(s);
    for (const r of [0.01, 0.99] as const) {
      vi.spyOn(Math, 'random').mockReturnValue(r);
      const move = getAIMove(s, 'player1', 'medium');
      expect(move).not.toBeNull();
      expect(valids).toContain(move!.pit);
      vi.restoreAllMocks();
    }
  }, 15_000);
});
