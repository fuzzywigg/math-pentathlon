/**
 * Wave 42 — Hex AI randomness factor still yields legal move.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — randomness', () => {
  it('easy with low random still returns legal midgame move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 0, col: 4 });
    const move = getBestMove(state, 'player1', 'easy');
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
  });
});
