/**
 * Wave 42 — Hex AI as player2 midgame legal + opening.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — player2 seat', () => {
  it('opening for player2 still prefers near-center', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState(7);
    state = makeMove(state, { row: 0, col: 0 }); // P1 first
    expect(state.currentPlayer).toBe('player2');
    expect(state.moveHistory.length).toBe(1); // still < 2 → center shortcut
    const move = getBestMove(state, 'player2', 'easy');
    const center = Math.floor(state.boardSize / 2);
    expect(Math.abs(move!.row - center)).toBeLessThanOrEqual(1);
    expect(Math.abs(move!.col - center)).toBeLessThanOrEqual(1);
  });

  it('midgame player2 returns legal empty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 1, col: 1 });
    state = makeMove(state, { row: 2, col: 1 });
    expect(state.currentPlayer).toBe('player2');
    const move = getBestMove(state, 'player2', 'medium');
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
  });
});
