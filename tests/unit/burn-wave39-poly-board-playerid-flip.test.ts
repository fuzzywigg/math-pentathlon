/**
 * Wave 39 — Board placePolyomino rotation+flip+playerId stamp.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  validatePlacement,
  getPlacementCells,
} from '../../src/core/polyomino';

const L = () => SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('Wave 39 poly — board playerId flip', () => {
  it('stamps playerId and agrees with validatePlacement cells', () => {
    const shape = L();
    const pos = { row: 2, col: 2 };
    const validation = validatePlacement(createBoard(8, 8), shape, pos, 180, true);
    expect(validation.valid).toBe(true);

    const board = placePolyomino(createBoard(8, 8), shape, pos, 180, true, 7);
    expect(board.placements[0].playerId).toBe(7);
    expect(board.placements[0].rotation).toBe(180);
    expect(board.placements[0].flipped).toBe(true);

    const cells = getPlacementCells(board.placements[0], [shape]);
    expect(cells.map((c) => `${c.row},${c.col}`).sort()).toEqual(
      validation.cells.map((c) => `${c.row},${c.col}`).sort()
    );
    for (const c of cells) {
      expect(board.cells[c.row][c.col]).toBe(true);
    }
  });

  it('throws when shape extends beyond board', () => {
    const shape = L();
    expect(() =>
      placePolyomino(createBoard(8, 8), shape, { row: 7, col: 7 }, 0, false)
    ).toThrow(/beyond board|Invalid placement|out of bounds|occupied/i);
  });
});
