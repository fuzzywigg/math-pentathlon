/**
 * Wave 41 — Juggle placeShape success + getBoardFillPercentage 0→partial.
 * Identity rejects + fill math. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';
import {
  createInitialState,
  placeShape,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';

const monomino = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

describe('Wave 41 juggle — placeShape + fill %', () => {
  it('empty board fill percentage is 0', () => {
    expect(getBoardFillPercentage(createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE))).toBe(
      0
    );
  });

  it('placeShape identity outside placing / without shape / invalid', () => {
    const rolling = createInitialState();
    expect(placeShape(rolling, { row: 0, col: 0 })).toBe(rolling);

    const placingNoDice = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: monomino,
      currentDice: null,
    };
    expect(placeShape(placingNoDice, { row: 0, col: 0 })).toBe(placingNoDice);

    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: monomino,
      currentDice: [1, 1] as [number, number],
    };
    expect(placeShape(placing, { row: -1, col: 0 })).toBe(placing);
  });

  it('place monomino fills one cell and bumps fill %', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: monomino,
      currentDice: [1, 2] as [number, number],
      selectedCategory: 'monomino' as const,
    };
    expect(getBoardFillPercentage(state.boards.player1)).toBe(0);
    const next = placeShape(state, { row: 4, col: 4 });
    expect(next).not.toBe(state);
    expect(next.boards.player1.cells[4][4]).toBeTruthy();
    expect(getBoardFillPercentage(next.boards.player1)).toBe(
      Math.round((1 / (CONFIG.GRID_SIZE * CONFIG.GRID_SIZE)) * 100)
    );
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
  });

  it('partial fill percentage rounds for multiple cells', () => {
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let i = 0; i < 9; i++) {
      board.cells[0][i] = true;
    }
    expect(getBoardFillPercentage(board)).toBe(
      Math.round((9 / (CONFIG.GRID_SIZE * CONFIG.GRID_SIZE)) * 100)
    );
  });
});
