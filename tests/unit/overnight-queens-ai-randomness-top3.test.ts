/**
 * Overnight TOKENMAXX HEAVY — queens-guards AI randomness top3 leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/queens-guards/ai';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import { createInitialState, cellKey, type QueensGuardsState } from '../../src/games/queens-guards/types';

afterEach(() => vi.restoreAllMocks());

function minimal(): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const [key, cell] of cells) cells.set(key, { ...cell, piece: null });
  cells.set(cellKey(5, 0), {
    ...cells.get(cellKey(5, 0))!,
    piece: { id: 'solo', player: 'player1', type: 'guard' },
  });
  return { ...base, cells, currentPlayer: 'player1' };
}

describe('Overnight queens — AI randomness top3', () => {
  it('low random still yields a legal move on minimal board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = minimal();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidMoves(state, move!.from).some(
      (m) => m.ring === move!.to.ring && m.position === move!.to.position
    )).toBe(true);
  });
});
