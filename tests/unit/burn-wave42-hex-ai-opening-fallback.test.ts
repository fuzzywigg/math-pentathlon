/**
 * Wave 42 — Hex AI opening when center ring is occupied.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — opening fallback', () => {
  it('falls through to scored search when center band filled', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const size = 5;
    const center = Math.floor(size / 2);
    const board = createInitialState(size).board.map((row, r) =>
      row.map((cell, c) =>
        Math.abs(r - center) <= 1 && Math.abs(c - center) <= 1
          ? (('player1' as const) || cell)
          : cell
      )
    );
    // Fill center 3x3 with alternating owners so empties remain outside
    for (let r = center - 1; r <= center + 1; r++) {
      for (let c = center - 1; c <= center + 1; c++) {
        board[r][c] = (r + c) % 2 === 0 ? 'player1' : 'player2';
      }
    }
    const state = {
      ...createInitialState(size),
      board,
      moveHistory: [], // length < 2 still tries center filter first
      currentPlayer: 'player1' as const,
    };
    // Center filter empty → fall through to scoredMoves
    const move = getBestMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
    expect(Math.abs(move!.row - center) > 1 || Math.abs(move!.col - center) > 1).toBe(
      true
    );
  });
});
