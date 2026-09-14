/**
 * Wave 38 — findAlignmentsForValue / findAllAlignments large-board stress.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentsForValue,
  findAllAlignments,
  findAlignmentFromCenter,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

describe('Wave 38 align-scan — striped 8×8 boards', () => {
  it('horizontal stripes of X every other row yield multiple alignments', () => {
    const board: CellValue[][] = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, () => (r % 2 === 0 ? ('X' as CellValue) : null))
    );
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 8,
      cols: 8,
      targetLength: 4,
      directions: [DIRECTIONS.HORIZONTAL],
    };
    const forX = findAlignmentsForValue('X', get, config);
    expect(forX.length).toBeGreaterThan(0);
    expect(forX.every((a) => a.value === 'X')).toBe(true);
    expect(forX.every((a) => a.length >= 4)).toBe(true);

    const forO = findAlignmentsForValue('O', get, config);
    expect(forO).toHaveLength(0);
  });

  it('full board with targetLength 5 finds alignments in all default dirs', () => {
    const board: CellValue[][] = Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, () => 'P' as CellValue)
    );
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 6,
      cols: 6,
      targetLength: 5,
      directions: ALL_DIRECTIONS,
    };
    const all = findAllAlignments(get, config);
    expect(all.length).toBeGreaterThan(10);
    const names = new Set(all.map((a) => a.direction.name));
    expect(names.has('horizontal')).toBe(true);
    expect(names.has('vertical')).toBe(true);
  });
});

describe('Wave 38 align-scan — from-center length ladder', () => {
  it('center of a 1..7 horizontal run reports exact length', () => {
    for (let len = 1; len <= 7; len++) {
      const row: CellValue[] = Array.from({ length: 9 }, () => null);
      const start = 1;
      for (let i = 0; i < len; i++) row[start + i] = 'Z';
      const board = [row];
      const get = createArrayGetter(board);
      const mid = start + Math.floor((len - 1) / 2);
      const result = findAlignmentFromCenter(
        0,
        mid,
        DIRECTIONS.HORIZONTAL,
        get,
        { rows: 1, cols: 9, targetLength: 1 }
      );
      expect(result).not.toBeNull();
      expect(result!.length).toBe(len);
    }
  });
});
