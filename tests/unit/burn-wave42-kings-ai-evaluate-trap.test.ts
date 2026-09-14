/**
 * Wave 42 — Kings evaluatePosition ±10000 when trapped. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluatePosition } from '../../src/games/kings-quadraphages/ai';
import {
  BOARD_SIZE,
  type Board,
} from '../../src/games/kings-quadraphages/board';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

function emptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function trapCorner(
  victim: 'player1' | 'player2',
  free: 'player1' | 'player2'
) {
  const board = emptyBoard();
  board[0][0] = { type: 'king', owner: victim };
  board[4][4] = { type: 'king', owner: free };
  board[0][1] = { type: 'quadraphage', owner: free };
  board[1][0] = { type: 'quadraphage', owner: free };
  board[1][1] = { type: 'quadraphage', owner: free };
  return {
    ...createInitialGameState(),
    board,
  };
}

describe('Wave 42 kings — AI evaluate trap', () => {
  it('opponent trapped → +10000 for evaluator', () => {
    const state = trapCorner('player2', 'player1');
    expect(evaluatePosition(state, 'player1')).toBe(10000);
  });

  it('self trapped → -10000 for evaluator', () => {
    const state = trapCorner('player2', 'player1');
    expect(evaluatePosition(state, 'player2')).toBe(-10000);
  });

  it('opening score is finite and not ±10000', () => {
    const state = createInitialGameState();
    const score = evaluatePosition(state, 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(score).not.toBe(10000);
    expect(score).not.toBe(-10000);
  });

  it('symmetric trap of player1 yields +10000 for player2', () => {
    const state = trapCorner('player1', 'player2');
    expect(evaluatePosition(state, 'player2')).toBe(10000);
    expect(evaluatePosition(state, 'player1')).toBe(-10000);
  });
});
