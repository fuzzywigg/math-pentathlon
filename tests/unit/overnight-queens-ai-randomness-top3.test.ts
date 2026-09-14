/**
 * Overnight HEAVY — Queens easy/medium randomness top-3 on minimal board.
 * Reinforces seed path distinct from wave42 high-random hard path.
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

/** Single guard — full opening minimax is too heavy for unit tests. */
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

describe('Overnight queens — randomness top3', () => {
  it('easy randomness < 0.4 picks a legal move among top', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.01)
      .mockReturnValueOnce(1);
    const state = minimalAIState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const valids = getValidMoves(state, move!.from);
    expect(
      valids.some(
        (m) => m.ring === move!.to.ring && m.position === move!.to.position
      )
    ).toBe(true);
  });

  it('medium randomness < 0.15 still legal', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.05)
      .mockReturnValueOnce(0);
    const state = minimalAIState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.from.ring).toBe(5);
  });
});
