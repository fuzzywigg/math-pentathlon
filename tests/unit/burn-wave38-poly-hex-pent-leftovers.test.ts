/**
 * Wave 38 — polyomino hex-pattern / pentomino place leftovers after #171.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  HEX_PATTERN_BLOCKS,
  PENTOMINOES,
  createBoard,
  placePolyomino,
  validatePlacement,
  canPlaceShape,
  countEmptyCells,
  findValidPlacements,
} from '../../src/core/polyomino';

describe('Wave 38 poly-hex — pattern blocks place on open boards', () => {
  it('every hex pattern block places at origin on 6×6', () => {
    for (const shape of HEX_PATTERN_BLOCKS) {
      const board = createBoard(6, 6);
      expect(validatePlacement(board, shape, { row: 0, col: 0 }).valid).toBe(
        true
      );
      const placed = placePolyomino(board, shape, { row: 0, col: 0 });
      expect(countEmptyCells(placed)).toBe(36 - shape.cells.length);
    }
  });
});

describe('Wave 38 poly-pent — placeability leftovers on 6×6', () => {
  it('every pentomino can place somewhere on a 6×6 board', () => {
    const board = createBoard(6, 6);
    for (const shape of PENTOMINOES) {
      expect(canPlaceShape(board, shape)).toBe(true);
      expect(findValidPlacements(board, shape).length).toBeGreaterThan(0);
    }
  });

  it('I5 fits flat on 2×5; rotated needs tall board', () => {
    const I = PENTOMINOES.find((s) => s.id === 'I5')!;
    expect(
      validatePlacement(createBoard(2, 5), I, { row: 0, col: 0 }, 0).valid
    ).toBe(true);
    expect(
      validatePlacement(createBoard(2, 5), I, { row: 0, col: 0 }, 90).valid
    ).toBe(false);
    expect(
      validatePlacement(createBoard(5, 2), I, { row: 0, col: 0 }, 90).valid
    ).toBe(true);
  });
});
