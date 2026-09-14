/**
 * Wave 24 — grid-alignment core APIs (direct module, not compat wrappers).
 * Distinct from wave 21 hex-region contiguous, wave 22 highlight-ui, and
 * alignment.test.ts which exercises compat signatures.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  isInBounds,
  wrapPosition,
  findAlignmentInDirection,
  findAlignmentsForValue,
  findAllAlignments,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function boardGetter(board: CellValue[][]) {
  return createArrayGetter(board);
}

const cfg = (
  overrides: Partial<AlignmentConfig> & Pick<AlignmentConfig, 'rows' | 'cols'>
): AlignmentConfig => ({
  targetLength: 3,
  directions: ALL_DIRECTIONS,
  wrap: false,
  ...overrides,
});

describe('Wave 24 grid-alignment — bounds / wrap / getter', () => {
  it('isInBounds rejects negatives and past edges', () => {
    expect(isInBounds(0, 0, 3, 3)).toBe(true);
    expect(isInBounds(2, 2, 3, 3)).toBe(true);
    expect(isInBounds(-1, 0, 3, 3)).toBe(false);
    expect(isInBounds(0, -1, 3, 3)).toBe(false);
    expect(isInBounds(3, 0, 3, 3)).toBe(false);
    expect(isInBounds(0, 3, 3, 3)).toBe(false);
  });

  it('wrapPosition normalizes negative and overflow coords', () => {
    expect(wrapPosition(-1, 0, 4, 5)).toEqual({ row: 3, col: 0 });
    expect(wrapPosition(0, -1, 4, 5)).toEqual({ row: 0, col: 4 });
    expect(wrapPosition(4, 5, 4, 5)).toEqual({ row: 0, col: 0 });
    expect(wrapPosition(9, 12, 4, 5)).toEqual({ row: 1, col: 2 });
  });

  it('createArrayGetter returns in-bounds values and null OOB', () => {
    const board: CellValue[][] = [
      ['X', null],
      [null, 'O'],
    ];
    const get = boardGetter(board);
    expect(get(0, 0)).toBe('X');
    expect(get(1, 1)).toBe('O');
    expect(get(0, 1)).toBeNull();
    expect(get(-1, 0)).toBeNull();
    expect(get(0, 2)).toBeNull();
    expect(get(2, 0)).toBeNull();
  });
});

describe('Wave 24 grid-alignment — findAlignmentInDirection', () => {
  it('returns null on empty start or short run', () => {
    const board: CellValue[][] = [
      [null, 'X', 'X'],
      ['X', 'X', null],
      [null, null, null],
    ];
    const get = boardGetter(board);
    const config = cfg({ rows: 3, cols: 3, targetLength: 3 });

    expect(
      findAlignmentInDirection(0, 0, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
    expect(
      findAlignmentInDirection(0, 1, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });

  it('finds horizontal run of targetLength', () => {
    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = boardGetter(board);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 3, cols: 3, targetLength: 3 })
    );
    expect(hit).not.toBeNull();
    expect(hit!.value).toBe('X');
    expect(hit!.length).toBe(3);
    expect(hit!.positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
    expect(hit!.direction.name).toBe('horizontal');
  });

  it('finds vertical and diagonal-down runs', () => {
    const board: CellValue[][] = [
      ['O', null, 'O'],
      ['O', 'O', null],
      ['O', null, 'O'],
    ];
    const get = boardGetter(board);
    const config = cfg({ rows: 3, cols: 3, targetLength: 3 });

    const vert = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.VERTICAL,
      get,
      config
    );
    expect(vert?.length).toBe(3);
    expect(vert?.value).toBe('O');

    const diag = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.DIAGONAL_DOWN,
      get,
      config
    );
    // (0,0)=O, (1,1)=O, (2,2)=O
    expect(diag?.length).toBe(3);
  });

  it('stops at opponent and respects wrap across edges', () => {
    const board: CellValue[][] = [
      ['X', 'O', 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = boardGetter(board);
    expect(
      findAlignmentInDirection(
        0,
        0,
        DIRECTIONS.HORIZONTAL,
        get,
        cfg({ rows: 3, cols: 3, targetLength: 2 })
      )?.length
    ).toBeUndefined();

    // Toroidal: wrap so col 2 and col 0 connect horizontally for length 2
    const wrapBoard: CellValue[][] = [
      ['X', null, 'X'],
      [null, null, null],
    ];
    const wrapGet = boardGetter(wrapBoard);
    const wrapped = findAlignmentInDirection(
      0,
      2,
      DIRECTIONS.HORIZONTAL,
      wrapGet,
      cfg({ rows: 2, cols: 3, targetLength: 2, wrap: true })
    );
    expect(wrapped?.length).toBe(2);
    expect(wrapped?.positions.map((p) => `${p.row},${p.col}`)).toEqual([
      '0,2',
      '0,0',
    ]);
  });
});

describe('Wave 24 grid-alignment — findAlignmentsForValue / findAllAlignments', () => {
  it('collects alignments for one value and dedupes direction starts', () => {
    const board: CellValue[][] = [
      ['X', 'X', 'X', null],
      [null, null, null, null],
      ['O', 'O', 'O', null],
      [null, null, null, null],
    ];
    const get = boardGetter(board);
    const config = cfg({ rows: 4, cols: 4, targetLength: 3 });

    const xs = findAlignmentsForValue('X', get, config);
    expect(xs.length).toBeGreaterThanOrEqual(1);
    expect(xs.every((a) => a.value === 'X')).toBe(true);
    expect(xs.some((a) => a.direction.name === 'horizontal')).toBe(true);

    const os = findAlignmentsForValue('O', get, config);
    expect(os.length).toBeGreaterThanOrEqual(1);
    expect(os.every((a) => a.value === 'O')).toBe(true);

    const none = findAlignmentsForValue('Z', get, config);
    expect(none).toEqual([]);
  });

  it('findAllAlignments returns both players and empty board yields []', () => {
    const empty: CellValue[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    expect(
      findAllAlignments(boardGetter(empty), cfg({ rows: 3, cols: 3 }))
    ).toEqual([]);

    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      ['O', null, null],
      ['O', null, null],
    ];
    // vertical O needs one more — only X wins
    const all = findAllAlignments(
      boardGetter(board),
      cfg({ rows: 3, cols: 3, targetLength: 3 })
    );
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all.every((a) => a.value === 'X' || a.value === 'O')).toBe(true);
    expect(all.some((a) => a.value === 'X')).toBe(true);
  });

  it('honors direction filter (horizontal only)', () => {
    const board: CellValue[][] = [
      ['X', null, null],
      ['X', null, null],
      ['X', null, null],
    ];
    const get = boardGetter(board);
    const horizOnly = findAllAlignments(
      get,
      cfg({
        rows: 3,
        cols: 3,
        targetLength: 3,
        directions: [DIRECTIONS.HORIZONTAL],
      })
    );
    expect(horizOnly).toEqual([]);

    const vertOnly = findAllAlignments(
      get,
      cfg({
        rows: 3,
        cols: 3,
        targetLength: 3,
        directions: [DIRECTIONS.VERTICAL],
      })
    );
    expect(vertOnly.length).toBe(1);
    expect(vertOnly[0].direction.name).toBe('vertical');
  });
});
