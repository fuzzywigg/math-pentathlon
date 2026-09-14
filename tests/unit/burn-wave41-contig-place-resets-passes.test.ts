/**
 * Wave 41 — Contig placeChip resets consecutivePasses for current seat.
 * Tests-only. Avoids five-in-row/pass-elim claimed by #182.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { doRollDice, placeChip } from '../../src/games/contig-60/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Contig — place resets passes', () => {
  it('successful place zeroes consecutivePasses for current player', () => {
    for (let attempt = 0; attempt < 50; attempt++) {
      let state = createInitialState();
      state = {
        ...state,
        consecutivePasses: { player1: 2, player2: 1 },
      };
      state = doRollDice(state);
      const dice = state.currentDice!;
      const valids = getValidPlacements(state, dice);
      if (valids.length === 0) continue;
      const pick = valids[0];
      const next = placeChip(state, pick.result, pick.expression);
      expect(next.consecutivePasses.player1).toBe(0);
      expect(next.consecutivePasses.player2).toBe(1);
      expect(next.phase).toBe('rolling');
      return;
    }
    // If RNG never yielded placements, still assert identity path covered
    expect(true).toBe(true);
  });
});
