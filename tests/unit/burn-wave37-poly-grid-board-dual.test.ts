/**
 * Wave 37 — Grid API ↔ Board API semantic dual agreement.
 * Beyond wave 28 grid-edges / board-edges silos. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  createBoard,
  placePolyomino,
  isValidPlacement,
  validatePlacement,
  getAllValidPositions,
  findValidPlacements,
  removePolyomino,
  removeLastPolyomino,
  isCellOccupied,
  isOccupied,
  countEmptyCells,
  SIMPLE_SHAPES,
  TETROMINOES,
  getPlacementCells,
} from '../../src/core/polyomino';

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
const O = TETROMINOES.find((s) => s.id === 'O')!;

describe('Wave 37 poly-dual — empty board agreement', () => {
  it('monomino valid positions equal across Grid and Board', () => {
    const gridPos = getAllValidPositions(createGrid(3, 4), mono, 0, false);
    const boardPos = findValidPlacements(createBoard(3, 4), mono, 0, false);
    expect(gridPos).toHaveLength(12);
    expect(boardPos).toHaveLength(12);
    const key = (p: { row: number; col: number }) => `${p.row},${p.col}`;
    expect(new Set(gridPos.map(key))).toEqual(new Set(boardPos.map(key)));
  });

  it('O-tetromino position counts match on 4×4', () => {
    expect(
      getAllValidPositions(createGrid(4, 4), O, 0, false)
    ).toHaveLength(9);
    expect(findValidPlacements(createBoard(4, 4), O, 0, false)).toHaveLength(9);
  });
});

describe('Wave 37 poly-dual — place then occupancy', () => {
  it('placing O marks the same 2×2 footprint on both APIs', () => {
    const grid = placePolyomino(createGrid(5, 5), O, { row: 1, col: 1 });
    const board = placePolyomino(createBoard(5, 5), O, { row: 1, col: 1 });
    for (let r = 1; r <= 2; r++) {
      for (let c = 1; c <= 2; c++) {
        expect(isCellOccupied(grid, r, c)).toBe(true);
        expect(isOccupied(board, { row: r, col: c })).toBe(true);
      }
    }
    expect(countEmptyCells(board)).toBe(25 - 4);
  });

  it('isValidPlacement false after Grid O place; validatePlacement false after Board O place', () => {
    const grid = placePolyomino(createGrid(4, 4), O, { row: 0, col: 0 });
    const board = placePolyomino(createBoard(4, 4), O, { row: 0, col: 0 });
    expect(isValidPlacement(grid, O, { row: 0, col: 0 })).toBe(false);
    expect(isValidPlacement(grid, O, { row: 2, col: 2 })).toBe(true);
    expect(validatePlacement(board, O, { row: 0, col: 0 }).valid).toBe(false);
    expect(validatePlacement(board, O, { row: 2, col: 2 }).valid).toBe(true);
  });
});

describe('Wave 37 poly-dual — remove restores capacity', () => {
  it('Grid removePolyomino restores all monomino slots', () => {
    let grid = placePolyomino(createGrid(2, 2), { ...mono, id: 'a' }, {
      row: 0,
      col: 0,
    });
    grid = placePolyomino(grid, { ...mono, id: 'b' }, { row: 1, col: 1 });
    expect(getAllValidPositions(grid, mono, 0, false)).toHaveLength(2);
    grid = removePolyomino(grid, 'a');
    expect(getAllValidPositions(grid, mono, 0, false)).toHaveLength(3);
    grid = removePolyomino(grid, 'b');
    expect(getAllValidPositions(grid, mono, 0, false)).toHaveLength(4);
  });

  it('Board removeLastPolyomino undoes last place', () => {
    let board = placePolyomino(createBoard(3, 3), O, { row: 0, col: 0 });
    board = placePolyomino(board, mono, { row: 2, col: 2 });
    expect(board.placements).toHaveLength(2);
    board = removeLastPolyomino(board, [O, mono]);
    expect(board.placements).toHaveLength(1);
    expect(isOccupied(board, { row: 2, col: 2 })).toBe(false);
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(true);
  });
});

describe('Wave 37 poly-dual — getPlacementCells Grid records', () => {
  it('Grid placement cells match translated domino footprint', () => {
    const grid = placePolyomino(createGrid(4, 4), domino, { row: 2, col: 1 });
    const cells = getPlacementCells(grid.placements[0]);
    expect(cells).toEqual([
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ]);
  });
});
