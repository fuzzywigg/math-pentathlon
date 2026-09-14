/**
 * Wave 38 — doPlacementsOverlap self / partial / miss leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  TETROMINOES,
  getShapeById,
  doPlacementsOverlap,
  getPlacementCells,
  type Placement,
} from '../../src/core/polyomino';

function place(
  id: string,
  row: number,
  col: number,
  rotation: 0 | 90 | 180 | 270 = 0,
  flipped = false
): Placement {
  const polyomino = getShapeById(id, TETROMINOES)!;
  return { polyomino, position: { row, col }, rotation, flipped };
}

describe('Wave 38 poly-overlap — self / miss', () => {
  it('placement overlaps itself', () => {
    const p = place('O', 0, 0);
    expect(doPlacementsOverlap(p, p)).toBe(true);
  });

  it('far placements miss', () => {
    expect(doPlacementsOverlap(place('O', 0, 0), place('O', 10, 10))).toBe(
      false
    );
  });

  it('partial share after translate overlaps', () => {
    const a = place('I', 0, 0);
    const b = place('I', 0, 2);
    // I is typically 1x4; offset by 2 shares two cells if horizontal
    const cellsA = getPlacementCells(a);
    const cellsB = getPlacementCells(b);
    const keysA = new Set(cellsA.map((c) => `${c.row},${c.col}`));
    const share = cellsB.some((c) => keysA.has(`${c.row},${c.col}`));
    expect(doPlacementsOverlap(a, b)).toBe(share);
  });

  it('rotated vs unrotated O still overlaps at same origin', () => {
    const a = place('O', 0, 0, 0);
    const b = place('O', 0, 0, 90);
    expect(doPlacementsOverlap(a, b)).toBe(true);
  });

  it('getPlacementCells length matches shape size', () => {
    const p = place('L', 2, 3, 90, true);
    expect(getPlacementCells(p)).toHaveLength(p.polyomino.cells.length);
  });
});
