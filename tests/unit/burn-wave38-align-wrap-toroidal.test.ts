/**
 * Wave 38 — toroidal wrap alignments / wrapPosition denser than wave 24 bounds.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  wrapPosition,
  findAlignmentInDirection,
  findAllAlignments,
  checkForWinner,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

describe('Wave 38 align-wrap — wrapPosition modular lattice', () => {
  it('wraps negatives and overflows for many sizes', () => {
    for (const rows of [2, 3, 5, 8]) {
      for (const cols of [2, 3, 5, 8]) {
        for (let r = -rows * 2; r <= rows * 2; r++) {
          for (let c = -cols * 2; c <= cols * 2; c++) {
            const w = wrapPosition(r, c, rows, cols);
            expect(w.row).toBeGreaterThanOrEqual(0);
            expect(w.row).toBeLessThan(rows);
            expect(w.col).toBeGreaterThanOrEqual(0);
            expect(w.col).toBeLessThan(cols);
            expect(w.row).toBe(((r % rows) + rows) % rows);
            expect(w.col).toBe(((c % cols) + cols) % cols);
          }
        }
      }
    }
  });
});

describe('Wave 38 align-wrap — horizontal wrap win on 1×4 ring', () => {
  it('three matching cells wrap across edge to win', () => {
    const board: CellValue[][] = [['X', null, 'X', 'X']];
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 1,
      cols: 4,
      targetLength: 3,
      wrap: true,
      directions: [DIRECTIONS.HORIZONTAL],
    };
    // start at col 2 → 2,3, then wrap to 0
    const align = findAlignmentInDirection(0, 2, DIRECTIONS.HORIZONTAL, get, config);
    expect(align).not.toBeNull();
    expect(align!.length).toBeGreaterThanOrEqual(3);
    expect(checkForWinner(get, config).hasWinner).toBe(true);
    expect(checkForWinner(get, config).winner).toBe('X');
  });

  it('without wrap the same board has no horizontal win from col2', () => {
    const board: CellValue[][] = [['X', null, 'X', 'X']];
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 1,
      cols: 4,
      targetLength: 3,
      wrap: false,
      directions: [DIRECTIONS.HORIZONTAL],
    };
    expect(findAlignmentInDirection(0, 2, DIRECTIONS.HORIZONTAL, get, config)).toBeNull();
    expect(findAllAlignments(get, config)).toHaveLength(0);
  });
});

describe('Wave 38 align-wrap — vertical wrap on tall strip', () => {
  it('wraps column into a 3-in-a-row', () => {
    const board: CellValue[][] = [
      ['O'],
      [null],
      ['O'],
      ['O'],
    ];
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 4,
      cols: 1,
      targetLength: 3,
      wrap: true,
      directions: [DIRECTIONS.VERTICAL],
    };
    const align = findAlignmentInDirection(2, 0, DIRECTIONS.VERTICAL, get, config);
    expect(align).not.toBeNull();
    expect(checkForWinner(get, { ...config, directions: ALL_DIRECTIONS }).hasWinner).toBe(
      true
    );
  });
});
