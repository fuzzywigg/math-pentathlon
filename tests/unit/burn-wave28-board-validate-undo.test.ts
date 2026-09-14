/**
 * Wave 28 — Board validatePlacement / place / undo / empty-cell accounting.
 * Distinct from Grid API burns and wave 21 solve-edges smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  isInBounds,
  isOccupied,
  validatePlacement,
  placePolyomino,
  removeLastPolyomino,
  countEmptyCells,
  getEmptyCells,
  isBoardFilled,
  SIMPLE_SHAPES,
  TETROMINOES,
  getPolyominoById,
} from '../../src/core/polyomino';

function mono() {
  return SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
}

describe('Wave 28 board-validate — bounds and occupancy reasons', () => {
  it('isInBounds / isOccupied treat OOB as occupied', () => {
    const b = createBoard(2, 2);
    expect(isInBounds(b, { row: 0, col: 0 })).toBe(true);
    expect(isInBounds(b, { row: 2, col: 0 })).toBe(false);
    expect(isOccupied(b, { row: -1, col: 0 })).toBe(true);
    expect(isOccupied(b, { row: 0, col: 0 })).toBe(false);
  });

  it('validatePlacement returns boundary reason when shape spills', () => {
    const b = createBoard(2, 2);
    const O = getPolyominoById('O')!;
    const bad = validatePlacement(b, O, { row: 1, col: 0 });
    expect(bad.valid).toBe(false);
    expect(bad.reason).toBe('Shape extends beyond board boundaries');
    expect(bad.cells.length).toBe(4);
  });

  it('validatePlacement returns occupied reason on collision', () => {
    let b = createBoard(3, 3);
    b = placePolyomino(b, mono(), { row: 0, col: 0 });
    const clash = validatePlacement(b, mono(), { row: 0, col: 0 });
    expect(clash.valid).toBe(false);
    expect(clash.reason).toBe('Space is already occupied');
  });

  it('valid placement returns cells covering the shape', () => {
    const b = createBoard(4, 4);
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const ok = validatePlacement(b, T, { row: 0, col: 0 }, 0, false);
    expect(ok.valid).toBe(true);
    expect(ok.cells).toHaveLength(4);
    expect(ok.reason).toBeUndefined();
  });
});

describe('Wave 28 board-validate — placePolyomino Board overload', () => {
  it('records rotation, flip, and playerId on placement', () => {
    const b0 = createBoard(5, 5);
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const b1 = placePolyomino(b0, L, { row: 1, col: 1 }, 90, true, 2);
    expect(b1.placements).toHaveLength(1);
    expect(b1.placements[0]).toEqual({
      shapeId: 'tromino-L',
      position: { row: 1, col: 1 },
      rotation: 90,
      flipped: true,
      playerId: 2,
    });
    // three cells marked true
    let occupied = 0;
    for (const row of b1.cells) for (const c of row) if (c) occupied++;
    expect(occupied).toBe(3);
    expect(b0.placements).toHaveLength(0);
  });

  it('throws on invalid Board placement', () => {
    const b = createBoard(1, 1);
    const d = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    expect(() => placePolyomino(b, d, { row: 0, col: 0 })).toThrow(
      /Invalid placement|beyond board|occupied/
    );
  });

  it('rotated I fits a tall board and fills a column', () => {
    let b = createBoard(4, 1);
    const I = getPolyominoById('I')!;
    b = placePolyomino(b, I, { row: 0, col: 0 }, 90, false);
    expect(isBoardFilled(b)).toBe(true);
    expect(countEmptyCells(b)).toBe(0);
  });
});

describe('Wave 28 board-validate — undo and empty accounting', () => {
  it('removeLastPolyomino undoes last piece; empty board is identity', () => {
    const shapes = SIMPLE_SHAPES;
    let b = createBoard(3, 3);
    expect(removeLastPolyomino(b, shapes)).toBe(b);

    b = placePolyomino(b, mono(), { row: 0, col: 0 });
    b = placePolyomino(b, mono(), { row: 2, col: 2 });
    expect(countEmptyCells(b)).toBe(7);
    const undone = removeLastPolyomino(b, shapes);
    expect(undone.placements).toHaveLength(1);
    expect(undone.cells[2][2]).toBe(false);
    expect(undone.cells[0][0]).toBe(true);
    expect(getEmptyCells(undone)).toHaveLength(8);
  });

  it('getEmptyCells enumerates all free coordinates in row-major order', () => {
    let b = createBoard(2, 2);
    b = placePolyomino(b, mono(), { row: 0, col: 1 });
    expect(getEmptyCells(b)).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
  });

  it('isBoardFilled tracks progressive monomino fill of 2×2', () => {
    let b = createBoard(2, 2);
    expect(isBoardFilled(b)).toBe(false);
    const coords = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ] as const;
    coords.forEach(([r, c], i) => {
      b = placePolyomino(b, { ...mono(), id: `m${i}` }, { row: r, col: c });
    });
    expect(isBoardFilled(b)).toBe(true);
    expect(countEmptyCells(b)).toBe(0);
  });

  it('removeLast with unknown shapeId leaves board unchanged', () => {
    let b = createBoard(2, 2);
    b = placePolyomino(b, mono(), { row: 0, col: 0 });
    // Force a placement whose shape is not in the provided catalog
    const orphan = {
      ...b,
      placements: [
        {
          shapeId: 'missing-shape',
          position: { row: 1, col: 1 },
          rotation: 0 as const,
          flipped: false,
        },
      ],
    };
    // Mark cell so occupancy exists without matching shape
    orphan.cells[1][1] = true;
    const result = removeLastPolyomino(orphan, SIMPLE_SHAPES);
    expect(result).toBe(orphan);
  });
});
