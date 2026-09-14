/**
 * Wave 42 — Hex AI hard midgame returns legal empty cell.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — hard midgame', () => {
  it('returns a valid empty cell after opening stones', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 0, col: 0 });
    state = makeMove(state, { row: 2, col: 3 });
    state = makeMove(state, { row: 4, col: 4 });
    const move = getBestMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
  });
});
