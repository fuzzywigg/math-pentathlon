/**
 * Overnight HEAVY leftover after #250 — findAlignmentInDirection wrap hops the
 * torus edge. Distinct from wave52 wrap-zero-dims NaN. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  findAlignmentInDirection,
  createArrayGetter,
  DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 55 core align — wrap torus line', () => {
  it('horizontal wrap joins last and first column of the same row', () => {
    const board = [
      ['X', null, 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentInDirection(0, 2, DIRECTIONS.HORIZONTAL, get, {
      rows: 3,
      cols: 3,
      targetLength: 2,
      wrap: true,
    });
    expect(hit).not.toBeNull();
    expect(hit!.length).toBeGreaterThanOrEqual(2);
    expect(hit!.positions).toEqual(
      expect.arrayContaining([
        { row: 0, col: 2 },
        { row: 0, col: 0 },
      ])
    );

    const noWrap = findAlignmentInDirection(0, 2, DIRECTIONS.HORIZONTAL, get, {
      rows: 3,
      cols: 3,
      targetLength: 2,
      wrap: false,
    });
    expect(noWrap).toBeNull();
  });
});
