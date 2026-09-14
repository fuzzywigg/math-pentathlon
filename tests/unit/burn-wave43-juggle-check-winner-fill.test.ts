/**
 * Wave 43 — Juggle checkWinner / canMakeAnyMove leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  checkWinner,
  canMakeAnyMove,
  placeShape,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { placePolyomino } from '../../src/core/polyomino/placement';

describe('Wave 43 juggle — winner + canMakeAnyMove', () => {
  it('checkWinner null on empty; player1 when p1 board filled', () => {
    const s = createInitialState();
    expect(checkWinner(s.boards)).toBeNull();

    let board = s.boards.player1;
    const mono = SHAPE_POOLS.monomino[0];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        board = placePolyomino(board, mono, { row, col }, 0, false, 1);
      }
    }
    expect(checkWinner({ player1: board, player2: s.boards.player2 })).toBe('player1');
  });

  it('canMakeAnyMove false without dice; true for mono on empty board', () => {
    expect(canMakeAnyMove(createInitialState())).toBe(false);
    const s = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
    };
    expect(canMakeAnyMove(s)).toBe(true);
  });

  it('filling last cell via placeShape settles gameOver for current seat', () => {
    const mono = SHAPE_POOLS.monomino[0];
    let board = createInitialState().boards.player1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 8 && col === 8) continue;
        board = placePolyomino(board, mono, { row, col }, 0, false, 1);
      }
    }
    const state = {
      ...createInitialState(),
      boards: { player1: board, player2: createInitialState().boards.player2 },
      phase: 'placing' as const,
      currentDice: [1, 2] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: mono,
    };
    const next = placeShape(state, { row: 8, col: 8 });
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentPlayer).toBe('player1');
  });
});
