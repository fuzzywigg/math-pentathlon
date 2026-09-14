/**
 * Wave 37 — blocked / hexagonal board × solvePlacement leftovers.
 * Beyond wave 28 board-solve-stress. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  createBoardWithBlockedCells,
  createHexagonalBoard,
  solvePlacement,
  placePolyomino,
  countEmptyCells,
  getEmptyCells,
  isBoardFilled,
  canPlaceShape,
  SIMPLE_SHAPES,
  TETROMINOES,
} from '../../src/core/polyomino';

const mono = () => SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = () => SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
const trominoI = () => SIMPLE_SHAPES.find((s) => s.id === 'tromino-I')!;

describe('Wave 37 poly-blocked — irregular boards', () => {
  it('blocked corners shrink empty count and block monomino there', () => {
    const board = createBoardWithBlockedCells(3, 3, [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ]);
    expect(countEmptyCells(board)).toBe(5);
    expect(getEmptyCells(board).every((c) => !(c.row === 0 && c.col === 0))).toBe(
      true
    );
  });

  it('solve monominoes fills non-blocked cells exactly', () => {
    const board = createBoardWithBlockedCells(2, 2, [{ row: 0, col: 1 }]);
    const shapes = [0, 1, 2].map((i) => ({ ...mono(), id: `m${i}` }));
    const sols = solvePlacement(board, shapes, 1);
    expect(sols).toHaveLength(1);
    expect(sols[0]).toHaveLength(3);
  });

  it('O cannot place on a board with a blocked cell inside its footprint', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    const board = createBoardWithBlockedCells(3, 3, [{ row: 0, col: 0 }]);
    expect(canPlaceShape(board, O)).toBe(true); // still room at (1,1)
    const tight = createBoardWithBlockedCells(2, 2, [{ row: 1, col: 1 }]);
    expect(canPlaceShape(tight, O)).toBe(false);
  });
});

describe('Wave 37 poly-hex-board — createHexagonalBoard', () => {
  it('radius 0 is a single empty cell', () => {
    const b = createHexagonalBoard(0);
    expect(b.rows).toBe(1);
    expect(b.cols).toBe(1);
    expect(countEmptyCells(b)).toBe(1);
    expect(isBoardFilled(b)).toBe(false);
  });

  it('radius 1 has 7 empty cells inside a 3×3 with corners blocked', () => {
    const b = createHexagonalBoard(1);
    expect(b.rows).toBe(3);
    expect(b.cols).toBe(3);
    expect(countEmptyCells(b)).toBe(7);
  });

  it('radius 2 empty count is 19', () => {
    expect(countEmptyCells(createHexagonalBoard(2))).toBe(19);
  });

  it('solve radius-0 with one monomino yields a filled solution', () => {
    const sols = solvePlacement(createHexagonalBoard(0), [mono()], 1);
    expect(sols).toHaveLength(1);
  });
});

describe('Wave 37 poly-solve — small exact tilings', () => {
  it('2×3 board tiles with three dominos', () => {
    const shapes = [0, 1, 2].map((i) => ({ ...domino(), id: `d${i}` }));
    const sols = solvePlacement(createBoard(2, 3), shapes, 2);
    expect(sols.length).toBeGreaterThanOrEqual(1);
    expect(sols[0]).toHaveLength(3);
  });

  it('3×3 with tromino-I ×3 has at least one solution', () => {
    const shapes = [0, 1, 2].map((i) => ({ ...trominoI(), id: `t${i}` }));
    const sols = solvePlacement(createBoard(3, 3), shapes, 1);
    expect(sols.length).toBeGreaterThanOrEqual(1);
  });

  it('unsolvable: 2×2 with three monominoes leaves remainder', () => {
    const shapes = [0, 1, 2].map((i) => ({ ...mono(), id: `m${i}` }));
    // 3 monominoes cannot fill 4 cells — solver returns empty when it cannot fill
    const sols = solvePlacement(createBoard(2, 2), shapes, 1);
    expect(sols).toEqual([]);
  });

  it('maxSolutions>1 collects multiple domino tilings of 2×2', () => {
    const shapes = [
      { ...domino(), id: 'd0' },
      { ...domino(), id: 'd1' },
    ];
    const sols = solvePlacement(createBoard(2, 2), shapes, 4);
    expect(sols.length).toBeGreaterThan(1);
  });
});
