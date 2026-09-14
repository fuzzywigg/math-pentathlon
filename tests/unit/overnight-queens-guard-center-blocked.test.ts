/**
 * Overnight TOKENMAXX HEAVY — queens-guards guard blocked from center leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';

describe('Overnight queens — guard blocked from center', () => {
  it('guard on ring1 does not list center as valid destination', () => {
    const state = createInitialState();
    // Place/find a guard on ring 1 for current player
    const cells = new Map(state.cells);
    // clear center and ring1
    cells.set(cellKey(0, 0), { ...cells.get(cellKey(0, 0))!, piece: null });
    cells.set(cellKey(1, 0), {
      ...cells.get(cellKey(1, 0))!,
      piece: { id: 'g1', player: 'player1', type: 'guard' },
    });
    const forged = { ...state, cells, currentPlayer: 'player1' as const };
    const moves = getValidMoves(forged, { ring: 1, position: 0 });
    expect(moves.some((m) => m.ring === 0 && m.position === 0)).toBe(false);
  });
});
