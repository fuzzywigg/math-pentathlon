/**
 * Wave 28 — solvePlacement solvability stress beyond wave 21 edges.
 * Distinct from board-find / validate burns. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  createBoardWithBlockedCells,
  createHexagonalBoard,
  solvePlacement,
  countEmptyCells,
  isBoardFilled,
  placePolyomino,
  SIMPLE_SHAPES,
  getPolyominoById,
  getPolyominoesByOrder,
} from '../../src/core/polyomino';

function mono() {
  return SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
}
function domino() {
  return SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
}

describe('Wave 28 board-solve — exact covers', () => {
  it('fills 2×2 with four monominoes', () => {
    const pieces = [0, 1, 2, 3].map((i) => ({ ...mono(), id: `m${i}` }));
    const sols = solvePlacement(createBoard(2, 2), pieces, 1);
    expect(sols).toHaveLength(1);
    expect(sols[0]).toHaveLength(4);
  });

  it('fills 2×2 with two dominoes', () => {
    const pieces = [
      { ...domino(), id: 'd1' },
      { ...domino(), id: 'd2' },
    ];
    const sols = solvePlacement(createBoard(2, 2), pieces, 2);
    expect(sols.length).toBeGreaterThanOrEqual(1);
    expect(sols[0]).toHaveLength(2);
  });

  it('fills 2×3 with two I-trominoes (full-row covers)', () => {
    const I = SIMPLE_SHAPES.find((s) => s.id === 'tromino-I')!;
    const sols = solvePlacement(
      createBoard(2, 3),
      [
        { ...I, id: 'I-a' },
        { ...I, id: 'I-b' },
      ],
      1
    );
    expect(sols).toHaveLength(1);
    expect(sols[0]).toHaveLength(2);
  });

  it('fills 2×3 with two L-trominoes', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const sols = solvePlacement(
      createBoard(2, 3),
      [
        { ...L, id: 'L-a' },
        { ...L, id: 'L-b' },
      ],
      1
    );
    expect(sols).toHaveLength(1);
    expect(sols[0]).toHaveLength(2);
  });

  it('O-tetromino alone fills exactly 2×2', () => {
    const O = getPolyominoById('O')!;
    const sols = solvePlacement(createBoard(2, 2), [O], 1);
    expect(sols).toHaveLength(1);
    expect(sols[0][0].shapeId).toBe('O');
  });
});

describe('Wave 28 board-solve — unsolvable and partial', () => {
  it('returns [] when shapes oversize the board', () => {
    const I = getPolyominoById('I')!;
    expect(solvePlacement(createBoard(2, 2), [I], 1)).toEqual([]);
  });

  it('returns [] when empties remain but no remaining shapes', () => {
    expect(solvePlacement(createBoard(2, 2), [mono()], 1)).toEqual([]);
  });

  it('maxSolutions>1 can collect multiple domino tilings', () => {
    const pieces = [
      { ...domino(), id: 'a' },
      { ...domino(), id: 'b' },
    ];
    const sols = solvePlacement(createBoard(2, 2), pieces, 8);
    expect(sols.length).toBeGreaterThan(1);
    for (const sol of sols) {
      expect(sol).toHaveLength(2);
    }
  });

  it('blocked board solves only the free region', () => {
    const board = createBoardWithBlockedCells(2, 2, [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
    ]);
    expect(countEmptyCells(board)).toBe(2);
    const pieces = [
      { ...mono(), id: 'x' },
      { ...mono(), id: 'y' },
    ];
    const sols = solvePlacement(board, pieces, 1);
    expect(sols).toHaveLength(1);
  });
});

describe('Wave 28 board-solve — hexagonal board geometry', () => {
  it('radius 0 is a single free cell', () => {
    const b = createHexagonalBoard(0);
    expect(b.rows).toBe(1);
    expect(b.cols).toBe(1);
    expect(countEmptyCells(b)).toBe(1);
    expect(solvePlacement(b, [mono()], 1)).toHaveLength(1);
  });

  it('radius 1 has 7 free cells (hex footprint)', () => {
    const b = createHexagonalBoard(1);
    expect(b.rows).toBe(3);
    expect(countEmptyCells(b)).toBe(7);
    expect(isBoardFilled(b)).toBe(false);
  });

  it('pre-filled monomino on hex r0 reports existing placements as solution', () => {
    let b = createHexagonalBoard(0);
    b = placePolyomino(b, mono(), { row: 0, col: 0 });
    expect(isBoardFilled(b)).toBe(true);
    const sols = solvePlacement(b, [], 1);
    expect(sols).toHaveLength(1);
    // Solver snapshots currentBoard.placements when already filled
    expect(sols[0]).toHaveLength(1);
    expect(sols[0][0].shapeId).toBe('monomino');
  });
});

describe('Wave 28 board-solve — order catalog handshake', () => {
  it('order-1/2/3 catalogs match SIMPLE_SHAPES sizes', () => {
    expect(getPolyominoesByOrder(1).every((s) => s.cells.length === 1)).toBe(
      true
    );
    expect(getPolyominoesByOrder(2)).toHaveLength(1);
    expect(getPolyominoesByOrder(3)).toHaveLength(2);
  });

  it('mixed I+L trominoes cannot tile 2×3 (I leaves a straight gap)', () => {
    const trominoes = getPolyominoesByOrder(3);
    expect(trominoes).toHaveLength(2);
    expect(solvePlacement(createBoard(2, 3), trominoes, 1)).toEqual([]);
  });

  it('two copies of L tromino from order-3 catalog tile 2×3', () => {
    const L = getPolyominoesByOrder(3).find((s) => s.id === 'tromino-L')!;
    expect(
      solvePlacement(
        createBoard(2, 3),
        [
          { ...L, id: 'L1' },
          { ...L, id: 'L2' },
        ],
        1
      )
    ).toHaveLength(1);
  });
});
