/**
 * Wave 42 — Hex AI easy exits opening shortcut after 2 history entries.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — post-opening easy', () => {
  it('after two stones scored search still legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 2, col: 1 });
    expect(state.moveHistory.length).toBe(2);
    const move = getBestMove(state, 'player1', 'easy');
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
  });
});
