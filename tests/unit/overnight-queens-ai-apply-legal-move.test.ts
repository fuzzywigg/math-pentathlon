/**
 * Overnight TOKENMAXX HEAVY — queens-guards apply legal move leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';
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

describe('Overnight queens — apply legal AI move', () => {
  it('applyAIMove mutates board for a normal AI move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = minimal();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = applyAIMove(state, move!);
    expect(next).not.toBe(state);
    expect(next.moveHistory.length).toBe(1);
  });
});
