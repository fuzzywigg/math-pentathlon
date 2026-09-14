/**
 * Wave 38 — findAlignmentFromCenter length/direction ladder denser than wave 24.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentFromCenter,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type CellValue,
} from '../../src/core/alignment/types';

describe('Wave 38 align-center — plus-shape expansions', () => {
  it('center of a plus reports full arm lengths per direction', () => {
    const board: CellValue[][] = [
      [null, null, 'X', null, null],
      [null, null, 'X', null, null],
      ['X', 'X', 'X', 'X', 'X'],
      [null, null, 'X', null, null],
      [null, null, 'X', null, null],
    ];
    const get = createArrayGetter(board);
    const cfg = { rows: 5, cols: 5, targetLength: 1 };
    const h = findAlignmentFromCenter(2, 2, DIRECTIONS.HORIZONTAL, get, cfg)!;
    expect(h.length).toBe(5);
    const v = findAlignmentFromCenter(2, 2, DIRECTIONS.VERTICAL, get, cfg)!;
    expect(v.length).toBe(5);
  });

  it('empty center returns null for every direction', () => {
    const board: CellValue[][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => null as CellValue)
    );
    const get = createArrayGetter(board);
    for (const d of ALL_DIRECTIONS) {
      expect(
        findAlignmentFromCenter(1, 1, d, get, { rows: 3, cols: 3, targetLength: 1 })
      ).toBeNull();
    }
  });

  it('diagonal-up and diagonal-down independent arms', () => {
    const board: CellValue[][] = [
      ['A', null, null, null, 'A'],
      [null, 'A', null, 'A', null],
      [null, null, 'A', null, null],
      [null, 'A', null, 'A', null],
      ['A', null, null, null, 'A'],
    ];
    const get = createArrayGetter(board);
    const cfg = { rows: 5, cols: 5, targetLength: 3 };
    const down = findAlignmentFromCenter(2, 2, DIRECTIONS.DIAGONAL_DOWN, get, cfg)!;
    const up = findAlignmentFromCenter(2, 2, DIRECTIONS.DIAGONAL_UP, get, cfg)!;
    expect(down.length).toBe(5);
    expect(up.length).toBe(5);
  });
});
