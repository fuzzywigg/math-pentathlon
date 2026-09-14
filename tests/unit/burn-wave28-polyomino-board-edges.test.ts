/**
 * Wave 28 — polyomino legacy Board API edges (validate reasons, place throws, undo).
 * Distinct from wave 21 solve/blocked-board matrix and polyomino.test undo smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  createBoardWithBlockedCells,
  isInBounds,
  isOccupied,
  validatePlacement,
  placePolyomino,
  removeLastPolyomino,
  findValidPlacements,
  canPlaceShape,
  countEmptyCells,
  getEmptyCells,
  isBoardFilled,
  findPlacementAtCell,
  TETROMINOES,
  getPolyominoesByOrder,
  type Rotation,
} from '../../src/core/polyomino';

describe('Wave 28 polyomino-board — isInBounds / isOccupied', () => {
  it('bounds matrix for 2x3 board', () => {
    const board = createBoard(2, 3);
    expect(isInBounds(board, { row: 0, col: 0 })).toBe(true);
    expect(isInBounds(board, { row: 1, col: 2 })).toBe(true);
    expect(isInBounds(board, { row: -1, col: 0 })).toBe(false);
    expect(isInBounds(board, { row: 0, col: 3 })).toBe(false);
    expect(isInBounds(board, { row: 2, col: 0 })).toBe(false);
  });

  it('OOB counts as occupied; empty in-bounds is free', () => {
    const board = createBoard(2, 2);
    expect(isOccupied(board, { row: -1, col: 0 })).toBe(true);
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(false);
    board.cells[0][0] = true;
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(true);
  });
});

describe('Wave 28 polyomino-board — validatePlacement reasons', () => {
  it('oversize I on 3x3 reports boundary reason', () => {
    const board = createBoard(3, 3);
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    const result = validatePlacement(board, i, { row: 0, col: 0 });
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/boundar/i);
    expect(result.cells).toHaveLength(4);
  });

  it('overlap reports occupied reason', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    let board = createBoard(4, 4);
    board = placePolyomino(board, o, { row: 0, col: 0 });
    const result = validatePlacement(board, o, { row: 0, col: 0 });
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/occupied/i);
  });

  it('valid O placement returns cells covering 2x2', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const result = validatePlacement(createBoard(4, 4), o, {
      row: 1,
      col: 1,
    });
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
    expect(result.cells).toHaveLength(4);
  });

  it('rotated I becomes valid on tall board', () => {
    const board = createBoard(4, 2);
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    expect(validatePlacement(board, i, { row: 0, col: 0 }, 0).valid).toBe(
      false
    );
    expect(validatePlacement(board, i, { row: 0, col: 0 }, 90).valid).toBe(
      true
    );
  });
});

describe('Wave 28 polyomino-board — placePolyomino throws / playerId', () => {
  it('invalid place throws with validation message', () => {
    const board = createBoard(2, 2);
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    expect(() => placePolyomino(board, i, { row: 0, col: 0 })).toThrow(
      /boundar|Invalid/i
    );
  });

  it('records playerId on placement when provided', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const board = placePolyomino(
      createBoard(3, 3),
      o,
      { row: 0, col: 0 },
      0,
      false,
      2
    );
    expect(board.placements[0].playerId).toBe(2);
    expect(board.placements[0].shapeId).toBe('O');
  });

  it('second overlapping place throws occupied', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const board = placePolyomino(createBoard(4, 4), o, { row: 0, col: 0 });
    expect(() => placePolyomino(board, o, { row: 0, col: 0 })).toThrow(
      /occupied|Invalid/i
    );
  });
});

describe('Wave 28 polyomino-board — removeLastPolyomino edges', () => {
  it('empty board undo returns same board reference-equivalent state', () => {
    const board = createBoard(3, 3);
    const undone = removeLastPolyomino(board, TETROMINOES);
    expect(undone.placements).toHaveLength(0);
    expect(countEmptyCells(undone)).toBe(9);
  });

  it('missing shape id in catalog leaves board unchanged', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    let board = placePolyomino(createBoard(3, 3), o, { row: 0, col: 0 });
    // Corrupt shapeId so shapes lookup fails
    board = {
      ...board,
      placements: [{ ...board.placements[0], shapeId: 'missing-xyz' }],
    };
    const undone = removeLastPolyomino(board, [o]);
    expect(undone).toBe(board);
    expect(countEmptyCells(undone)).toBe(5); // still occupied
  });

  it('undo after two placements restores only the last', () => {
    const m = getPolyominoesByOrder(1)[0];
    const m2 = { ...m, id: 'm2' };
    let board = createBoard(2, 2);
    board = placePolyomino(board, m, { row: 0, col: 0 });
    board = placePolyomino(board, m2, { row: 1, col: 1 });
    board = removeLastPolyomino(board, [m, m2]);
    expect(board.placements).toHaveLength(1);
    expect(board.placements[0].shapeId).toBe(m.id);
    expect(board.cells[0][0]).toBe(true);
    expect(board.cells[1][1]).toBe(false);
  });
});

describe('Wave 28 polyomino-board — findValid / canPlace / fill ledger', () => {
  it('findValidPlacements for O on 3x3 yields four anchors', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const positions = findValidPlacements(createBoard(3, 3), o);
    expect(positions).toHaveLength(4);
  });

  it('canPlaceShape false on fully blocked board', () => {
    const m = getPolyominoesByOrder(1)[0];
    const blocked = createBoardWithBlockedCells(2, 2, [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
    expect(canPlaceShape(blocked, m)).toBe(false);
    expect(isBoardFilled(blocked)).toBe(true);
    expect(getEmptyCells(blocked)).toEqual([]);
  });

  it('canPlaceShape tries rotations for I on tall thin board', () => {
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    expect(canPlaceShape(createBoard(4, 1), i)).toBe(true);
    expect(canPlaceShape(createBoard(1, 4), i)).toBe(true);
    expect(canPlaceShape(createBoard(3, 3), i)).toBe(false);
  });

  it('filling all cells with monominoes yields filled board', () => {
    let board = createBoard(2, 2);
    const shapes = [0, 1, 2, 3].map((i) => ({
      ...getPolyominoesByOrder(1)[0],
      id: `m${i}`,
    }));
    const anchors = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    for (let i = 0; i < 4; i++) {
      board = placePolyomino(board, shapes[i], anchors[i]);
    }
    expect(isBoardFilled(board)).toBe(true);
    expect(countEmptyCells(board)).toBe(0);
    expect(board.placements).toHaveLength(4);
  });

  it('findPlacementAtCell returns undefined for empty / unknown shape list', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const board = placePolyomino(createBoard(3, 3), o, { row: 0, col: 0 });
    expect(findPlacementAtCell(board, { row: 0, col: 0 }, [o])?.shapeId).toBe(
      'O'
    );
    expect(findPlacementAtCell(board, { row: 2, col: 2 }, [o])).toBeUndefined();
    expect(findPlacementAtCell(board, { row: 0, col: 0 }, [])).toBeUndefined();
  });

  it('findValidPlacements with flip for flippable L-like shape', () => {
    const shape = {
      id: 'hook',
      name: 'hook',
      cells: [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ],
      color: '#000',
      canRotate: true,
      canFlip: true,
      size: 3,
      order: 3,
    };
    const board = createBoard(3, 3);
    const plain = findValidPlacements(board, shape, 0 as Rotation, false);
    const flipped = findValidPlacements(board, shape, 0 as Rotation, true);
    expect(plain.length).toBeGreaterThan(0);
    expect(flipped.length).toBeGreaterThan(0);
    expect(canPlaceShape(board, shape)).toBe(true);
  });
});
