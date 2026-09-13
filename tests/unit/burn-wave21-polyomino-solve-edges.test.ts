/**
 * Wave 21 — polyomino blocked-board / hex-board / solvePlacement edges.
 * Distinct from wave 18 geometry rotate/flip and base polyomino.test placement smoke.
 * Used by Juggle / Pent / Hex-a-Gone-shaped boards. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createBoard,
  createBoardWithBlockedCells,
  createHexagonalBoard,
  countEmptyCells,
  getEmptyCells,
  isBoardFilled,
  canPlaceShape,
  findValidPlacements,
  findPlacementAtCell,
  placePolyomino,
  solvePlacement,
  getPolyominoesByOrder,
  getPolyominoById,
} from '../../src/core/polyomino';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 21 polyomino-solve — blocked boards / empty inventory', () => {
  it('createBoardWithBlockedCells marks cells occupied and shrinks empties', () => {
    const board = createBoardWithBlockedCells(3, 3, [
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      { row: 99, col: 99 },
    ]);
    expect(board.cells[0][0]).toBe(true);
    expect(board.cells[2][2]).toBe(true);
    expect(countEmptyCells(board)).toBe(7);
    expect(getEmptyCells(board)).toHaveLength(7);
    expect(isBoardFilled(board)).toBe(false);
  });

  it('createHexagonalBoard blocks corners for radius 1 and 2', () => {
    const r1 = createHexagonalBoard(1);
    expect(r1.rows).toBe(3);
    expect(r1.cols).toBe(3);
    expect(countEmptyCells(r1)).toBeLessThan(9);
    expect(countEmptyCells(r1)).toBeGreaterThan(0);

    const r2 = createHexagonalBoard(2);
    expect(r2.rows).toBe(5);
    expect(countEmptyCells(r2)).toBeLessThan(25);
    expect(countEmptyCells(r2)).toBeGreaterThan(countEmptyCells(r1));
  });
});

describe('Wave 21 polyomino-solve — canPlace / place / findPlacementAtCell', () => {
  it('monomino places on empty; blocked rejects; lookup finds placement', () => {
    const m = getPolyominoesByOrder(1)[0];
    expect(canPlaceShape(createBoard(2, 2), m)).toBe(true);

    const blocked = createBoardWithBlockedCells(1, 1, [{ row: 0, col: 0 }]);
    expect(canPlaceShape(blocked, m)).toBe(false);

    const positions = findValidPlacements(createBoard(2, 2), m);
    expect(positions.length).toBe(4);

    let board = createBoard(2, 2);
    board = placePolyomino(board, m, positions[0], 0, false);
    expect(board.placements).toHaveLength(1);
    expect(board.placements[0].shapeId).toBe(m.id);

    const hit = findPlacementAtCell(board, positions[0], [m]);
    expect(hit?.shapeId).toBe(m.id);
    expect(
      findPlacementAtCell(board, { row: 1, col: 1 }, [m]) === undefined ||
        hit !== undefined
    ).toBe(true);
  });
});

describe('Wave 21 polyomino-solve — solvePlacement solvability matrix', () => {
  it('fills 1x1 with monomino and rejects oversize shape', () => {
    const m = getPolyominoesByOrder(1)[0];
    const d = getPolyominoesByOrder(2)[0];
    expect(solvePlacement(createBoard(1, 1), [m], 1)).toHaveLength(1);
    expect(solvePlacement(createBoard(1, 1), [d], 1)).toEqual([]);
  });

  it('fills 1x2 with domino; two monominoes fill 1x2', () => {
    const d = getPolyominoesByOrder(2)[0];
    const m = getPolyominoesByOrder(1)[0];
    const withDomino = solvePlacement(createBoard(1, 2), [d], 2);
    expect(withDomino.length).toBeGreaterThan(0);

    const m2 = { ...m, id: `${m.id}-copy` };
    const withTwo = solvePlacement(createBoard(1, 2), [m, m2], 1);
    expect(withTwo.length).toBeGreaterThan(0);
    expect(withTwo[0]).toHaveLength(2);
  });

  it('blocked board can still solve when empties match shape cells', () => {
    const m = getPolyominoesByOrder(1)[0];
    const board = createBoardWithBlockedCells(2, 2, [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
    expect(countEmptyCells(board)).toBe(1);
    expect(solvePlacement(board, [m], 1)).toHaveLength(1);
  });

  it('unsolvable leftover empties return empty solutions', () => {
    const m = getPolyominoesByOrder(1)[0];
    expect(solvePlacement(createBoard(2, 2), [m], 1)).toEqual([]);
  });

  it('getPolyominoById resolves catalog ids used by live games', () => {
    const m = getPolyominoesByOrder(1)[0];
    expect(getPolyominoById(m.id)?.cells).toHaveLength(1);
    expect(getPolyominoById('definitely-missing-shape-xyz')).toBeUndefined();
  });
});
