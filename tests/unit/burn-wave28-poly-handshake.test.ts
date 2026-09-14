/**
 * Wave 28 — Grid↔Board handshake / dual-API placement consistency.
 * Distinct from separate Grid and Board burns. Tests-only. No product inventing.
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
  getPlacementCells,
  removePolyomino,
  removeLastPolyomino,
  SIMPLE_SHAPES,
  getPolyominoById,
  type Placement,
  type Grid,
  type Board,
} from '../../src/core/polyomino';

function mono() {
  return SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
}

function occupiedGrid(g: Grid): string[] {
  const keys: string[] = [];
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      if (g.cells[r][c].occupied) keys.push(`${r},${c}`);
    }
  }
  return keys.sort();
}

function occupiedBoard(b: Board): string[] {
  const keys: string[] = [];
  for (let r = 0; r < b.rows; r++) {
    for (let c = 0; c < b.cols; c++) {
      if (b.cells[r][c]) keys.push(`${r},${c}`);
    }
  }
  return keys.sort();
}

describe('Wave 28 poly-handshake — monomino occupancy parity', () => {
  it('placing the same monominoes yields identical occupied sets', () => {
    let grid = createGrid(3, 3);
    let board = createBoard(3, 3);
    const spots = [
      { row: 0, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ];
    spots.forEach((pos, i) => {
      const shape = { ...mono(), id: `m${i}` };
      grid = placePolyomino(grid, shape, pos);
      board = placePolyomino(board, shape, pos);
    });
    expect(occupiedGrid(grid)).toEqual(occupiedBoard(board));
    expect(grid.placements).toHaveLength(3);
    expect(board.placements).toHaveLength(3);
  });

  it('isValidPlacement matches validatePlacement.valid for identity transforms', () => {
    const grid = createGrid(4, 4);
    const board = createBoard(4, 4);
    const O = getPolyominoById('O')!;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const pos = { row: r, col: c };
        expect(isValidPlacement(grid, O, pos)).toBe(
          validatePlacement(board, O, pos, 0, false).valid
        );
      }
    }
  });
});

describe('Wave 28 poly-handshake — position enumeration at rot=0', () => {
  it('getAllValidPositions and findValidPlacements agree for flat domino', () => {
    const grid = createGrid(3, 4);
    const board = createBoard(3, 4);
    const d = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const gPos = getAllValidPositions(grid, d, 0, false)
      .map((p) => `${p.row},${p.col}`)
      .sort();
    const bPos = findValidPlacements(board, d, 0, false)
      .map((p) => `${p.row},${p.col}`)
      .sort();
    expect(gPos).toEqual(bPos);
  });

  it('after one shared placement, remaining monomino slots stay equal', () => {
    let grid = createGrid(3, 3);
    let board = createBoard(3, 3);
    const T = getPolyominoById('T')!;
    grid = placePolyomino(grid, T, { row: 0, col: 0 });
    board = placePolyomino(board, T, { row: 0, col: 0 });
    const gPos = getAllValidPositions(grid, mono(), 0, false)
      .map((p) => `${p.row},${p.col}`)
      .sort();
    const bPos = findValidPlacements(board, mono(), 0, false)
      .map((p) => `${p.row},${p.col}`)
      .sort();
    expect(gPos).toEqual(bPos);
    expect(gPos).toHaveLength(5); // 9 - 4
  });
});

describe('Wave 28 poly-handshake — removal paths', () => {
  it('Grid remove by id vs Board removeLast leave matching empties', () => {
    let grid = createGrid(2, 2);
    let board = createBoard(2, 2);
    const a = { ...mono(), id: 'a' };
    const b = { ...mono(), id: 'b' };
    grid = placePolyomino(grid, a, { row: 0, col: 0 });
    grid = placePolyomino(grid, b, { row: 1, col: 1 });
    board = placePolyomino(board, a, { row: 0, col: 0 });
    board = placePolyomino(board, b, { row: 1, col: 1 });

    grid = removePolyomino(grid, 'b');
    board = removeLastPolyomino(board, [a, b]);

    expect(occupiedGrid(grid)).toEqual(occupiedBoard(board));
    expect(occupiedGrid(grid)).toEqual(['0,0']);
  });
});

describe('Wave 28 poly-handshake — Placement cell extraction', () => {
  it('Grid Placement cells match Board PlacedPolyomino cells for same pose', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const placement: Placement = {
      polyomino: L,
      position: { row: 1, col: 1 },
      rotation: 180,
      flipped: true,
    };
    const fromGrid = getPlacementCells(placement);
    const fromBoard = getPlacementCells(
      {
        shapeId: L.id,
        position: { row: 1, col: 1 },
        rotation: 180,
        flipped: true,
      },
      SIMPLE_SHAPES
    );
    expect(fromGrid).toEqual(fromBoard);
    expect(fromGrid).toHaveLength(3);
  });
});
