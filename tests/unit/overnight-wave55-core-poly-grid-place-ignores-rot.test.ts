/**
 * Overnight HEAVY leftover after #250 — Grid placePolyomino always transform 0;
 * Board honors rotation. Distinct from wave52 overwrite / wave53 frozen I. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  createBoard,
  placePolyomino,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 55 core poly — grid place ignores rotation', () => {
  it('I at origin with rotation 90 stays flat on Grid; Board is vertical', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const grid = placePolyomino(createGrid(4, 4), I, { row: 0, col: 0 }, 90);
    expect(grid.cells[0][0].occupied).toBe(true);
    expect(grid.cells[0][3].occupied).toBe(true);
    expect(grid.cells[3][0].occupied).toBe(false);
    expect(grid.placements[0].rotation).toBe(0);

    const board = placePolyomino(createBoard(4, 4), I, { row: 0, col: 0 }, 90);
    expect(board.cells[0][0]).toBe(true);
    expect(board.cells[3][0]).toBe(true);
    expect(board.cells[0][3]).toBe(false);
    expect(board.placements[0].rotation).toBe(90);
  });
});
