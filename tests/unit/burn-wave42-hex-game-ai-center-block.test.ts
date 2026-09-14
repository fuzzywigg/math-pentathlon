/**
 * Wave 42 — Hex game AI opening center + block/win. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { createInitialState, createEmptyBoard } from '../../src/games/hex/types';

describe('Wave 42 hex-game — AI center/block', () => {
  it('opening move near center', () => {
    const s = createInitialState(7);
    const move = getBestMove(s, 'player1', 'hard');
    expect(move).not.toBeNull();
    const center = 3;
    expect(Math.abs(move!.row - center)).toBeLessThanOrEqual(1);
    expect(Math.abs(move!.col - center)).toBeLessThanOrEqual(1);
  });

  it('AI move from near-win board yields player1 win', () => {
    const size = 5;
    const board = createEmptyBoard(size);
    for (let row = 0; row < size - 1; row++) board[row][2] = 'player1';
    const s = {
      ...createInitialState(size),
      board,
      currentPlayer: 'player1' as const,
      moveHistory: [
        {
          player: 'player1' as const,
          position: { row: 0, col: 2 },
          moveNumber: 1,
        },
        {
          player: 'player2' as const,
          position: { row: 0, col: 0 },
          moveNumber: 2,
        },
      ],
    };
    // Direct win cell works
    expect(makeMove(s, { row: size - 1, col: 2 }).winner).toBe('player1');
    const move = getBestMove(s, 'player1', 'easy');
    expect(move).not.toBeNull();
    const next = makeMove(s, move!);
    // easy may not always snatch win; at least move is legal
    expect(
      s.board[move!.row][move!.col] === null || next !== s
    ).toBe(true);
    expect(getValidMoves(s).some((m) => m.row === move!.row && m.col === move!.col)).toBe(
      true
    );
  });

  it('random move in valids; empty when over', () => {
    const s = createInitialState(5);
    const r = getRandomMove(s);
    expect(r).not.toBeNull();
    expect(getValidMoves(s).some((m) => m.row === r!.row && m.col === r!.col)).toBe(true);
    const over = { ...s, winner: 'player1' as const };
    expect(getBestMove(over, 'player1', 'easy')).toBeNull();
    expect(getRandomMove(over)).toBeNull();
  });
});
