/**
 * Wave 39 — countAlignmentPotential blocked-arm leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  countAlignmentPotential,
  DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 39 align — potential blocked', () => {
  it('opponent on both arms marks blocked', () => {
    const board = [
      [null, 'O', null],
      ['O', 'X', 'O'],
      [null, 'O', null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const pot = countAlignmentPotential(1, 1, 'X', get, {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL],
    });
    const h = pot.get('horizontal')!;
    expect(h.count).toBe(1);
    expect(h.blocked).toBe(true);
    const v = pot.get('vertical')!;
    expect(v.count).toBe(1);
    expect(v.blocked).toBe(true);
  });

  it('open arm remains unblocked with matching pieces', () => {
    const board = [
      [null, null, null, null],
      ['X', 'X', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const pot = countAlignmentPotential(1, 0, 'X', get, {
      rows: 4,
      cols: 4,
      targetLength: 3,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    const h = pot.get('horizontal')!;
    expect(h.count).toBe(2);
    expect(h.blocked).toBe(false);
  });
});
