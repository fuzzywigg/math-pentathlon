/**
 * Overnight HEAVY after #210 — Queens hard randomness=0.05 branch.
 * #210 randomness covered easy/medium only.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/queens-guards/ai';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

afterEach(() => {
  vi.restoreAllMocks();
});

function minimalAIState(): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const [key, cell] of cells) {
    cells.set(key, { ...cell, piece: null });
  }
  cells.set(cellKey(5, 0), {
    ...cells.get(cellKey(5, 0))!,
    piece: { id: 'solo-g', player: 'player1', type: 'guard' },
  });
  return { ...base, cells, currentPlayer: 'player1' };
}

describe('Overnight queens — hard randomness branch', () => {
  it('hard random < 0.05 still returns a legal move', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.01)
      .mockReturnValueOnce(0);
    const state = minimalAIState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const valids = getValidMoves(state, move!.from);
    expect(
      valids.some(
        (m) => m.ring === move!.to.ring && m.position === move!.to.position
      )
    ).toBe(true);
  });

  it('hard random >= 0.05 equals deterministic top scored', () => {
    const state = minimalAIState();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const top = getAIMove(state, 'player1', 'hard');
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // skip hard randomness
    const again = getAIMove(state, 'player1', 'hard');
    expect(again).toEqual(top);
  });
});
