/**
 * Wave 38 — countAlignmentPotential blocked×count matrix denser than wave 24.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  countAlignmentPotential,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function setup(values: CellValue[][], opts: Partial<AlignmentConfig> = {}) {
  return {
    get: createArrayGetter(values),
    config: {
      rows: values.length,
      cols: values[0]?.length ?? 0,
      targetLength: 4,
      directions: ALL_DIRECTIONS,
      ...opts,
    } satisfies AlignmentConfig,
  };
}

describe('Wave 38 align-potential — corridor blocked both ends', () => {
  it('horizontal X surrounded by O is blocked with count 3', () => {
    const { get, config } = setup([
      [null, null, null, null, null],
      ['O', 'X', 'X', 'X', 'O'],
      [null, null, null, null, null],
    ]);
    const map = countAlignmentPotential(1, 2, 'X', get, config);
    expect(map.get('horizontal')!.count).toBe(3);
    expect(map.get('horizontal')!.blocked).toBe(true);
  });

  it('open corridor not blocked', () => {
    const { get, config } = setup([
      [null, null, null, null, null],
      [null, 'X', 'X', 'X', null],
      [null, null, null, null, null],
    ]);
    const map = countAlignmentPotential(1, 2, 'X', get, config);
    expect(map.get('horizontal')!.count).toBe(3);
    expect(map.get('horizontal')!.blocked).toBe(false);
  });
});

describe('Wave 38 align-potential — every cell on 5×5 filled board', () => {
  it('friendly flood counts grow; blocked true at edges without wrap', () => {
    const board: CellValue[][] = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => 'X' as CellValue)
    );
    const { get, config } = setup(board);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const map = countAlignmentPotential(r, c, 'X', get, config);
        expect(map.size).toBe(ALL_DIRECTIONS.length);
        for (const entry of map.values()) {
          expect(entry.count).toBeGreaterThanOrEqual(1);
          expect(entry.count).toBeLessThanOrEqual(5);
        }
        // corner: both ends of each axis hit bounds → blocked
        if ((r === 0 || r === 4) && (c === 0 || c === 4)) {
          expect(map.get('horizontal')!.blocked).toBe(true);
          expect(map.get('vertical')!.blocked).toBe(true);
        }
      }
    }
  });
});

describe('Wave 38 align-potential — opponent walls on tall board', () => {
  it('vertical corridor blocked by opponents both ends', () => {
    const board: CellValue[][] = [
      [null, 'O', null],
      [null, 'X', null],
      [null, 'X', null],
      [null, 'X', null],
      [null, 'O', null],
    ];
    const { get, config } = setup(board);
    const map = countAlignmentPotential(2, 1, 'X', get, config);
    expect(map.get('vertical')!.count).toBe(3);
    expect(map.get('vertical')!.blocked).toBe(true);
    expect(map.get('horizontal')!.count).toBe(1);
    expect(map.get('horizontal')!.blocked).toBe(false);
  });
});
