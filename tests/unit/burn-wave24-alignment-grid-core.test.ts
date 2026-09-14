/**
 * Wave 24 — grid-alignment core (n-in-a-row / wrap / move-win / potential).
 * Imports grid-alignment.ts directly (not compat wrappers).
 * Distinct from wave 22 highlight-ui and wave 20 board-bounds game checks.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  isInBounds,
  wrapPosition,
  findAlignmentInDirection,
  findAlignmentsForValue,
  findAllAlignments,
  checkForWinner,
  checkMoveForWin,
  findAlignmentFromCenter,
  countAlignmentPotential,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type AlignmentConfig,
} from '../../src/core/alignment/types';

describe('Wave 24 grid-alignment — bounds / wrap', () => {
  it('isInBounds and wrapPosition toroidal math', () => {
    expect(isInBounds(0, 0, 3, 3)).toBe(true);
    expect(isInBounds(-1, 0, 3, 3)).toBe(false);
    expect(isInBounds(0, 3, 3, 3)).toBe(false);
    expect(wrapPosition(-1, 0, 3, 3)).toEqual({ row: 2, col: 0 });
    expect(wrapPosition(3, -1, 3, 3)).toEqual({ row: 0, col: 2 });
    expect(wrapPosition(7, 5, 4, 4)).toEqual({ row: 3, col: 1 });
  });
});

describe('Wave 24 grid-alignment — find / winner / move', () => {
  const board = [
    ['X', 'X', 'X', null],
    [null, 'O', null, null],
    ['O', 'O', null, null],
    [null, null, null, 'X'],
  ];
  const get = createArrayGetter(board);
  const cfg: AlignmentConfig = {
    rows: 4,
    cols: 4,
    targetLength: 3,
    directions: ALL_DIRECTIONS,
  };

  it('findAlignmentInDirection skips empty and finds horizontal X', () => {
    expect(
      findAlignmentInDirection(1, 0, DIRECTIONS.HORIZONTAL, get, cfg)
    ).toBeNull();
    const line = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg
    );
    expect(line?.value).toBe('X');
    expect(line?.length).toBe(3);
    expect(line?.positions).toHaveLength(3);
  });

  it('findAlignmentsForValue and findAllAlignments / checkForWinner', () => {
    const xs = findAlignmentsForValue('X', get, cfg);
    expect(xs.length).toBeGreaterThanOrEqual(1);
    expect(xs.every((a) => a.value === 'X')).toBe(true);
    expect(findAlignmentsForValue('Z', get, cfg)).toEqual([]);

    const all = findAllAlignments(get, cfg);
    expect(all.some((a) => a.value === 'X')).toBe(true);
    const win = checkForWinner(get, cfg);
    expect(win.hasWinner).toBe(true);
    expect(win.winner).toBe('X');
    expect(win.alignments.length).toBeGreaterThan(0);

    const emptyGet = createArrayGetter([
      [null, null],
      [null, null],
    ]);
    expect(
      checkForWinner(emptyGet, { rows: 2, cols: 2, targetLength: 2 })
    ).toEqual({ hasWinner: false, winner: null, alignments: [] });
  });

  it('checkMoveForWin detects completing a line; misses non-winning drops', () => {
    const open = [
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ];
    const g = createArrayGetter(open);
    const c: AlignmentConfig = { rows: 3, cols: 3, targetLength: 3 };
    const win = checkMoveForWin(0, 2, 'X', g, c);
    expect(win.hasWinner).toBe(true);
    expect(win.winner).toBe('X');

    const miss = checkMoveForWin(2, 2, 'O', g, c);
    expect(miss.hasWinner).toBe(false);
    expect(miss.winner).toBeNull();
  });

  it('findAlignmentFromCenter spans both directions', () => {
    const mid = [
      ['A', null, null],
      ['A', null, null],
      ['A', null, null],
    ];
    const g = createArrayGetter(mid);
    const c: AlignmentConfig = { rows: 3, cols: 3, targetLength: 3 };
    const align = findAlignmentFromCenter(1, 0, DIRECTIONS.VERTICAL, g, c);
    expect(align?.length).toBe(3);
    expect(align?.start).toEqual({ row: 0, col: 0 });
    expect(align?.end).toEqual({ row: 2, col: 0 });
    expect(findAlignmentFromCenter(0, 1, DIRECTIONS.VERTICAL, g, c)).toBeNull();
  });
});

describe('Wave 24 grid-alignment — wrap wins and potential', () => {
  it('toroidal wrap finds alignment across board edge', () => {
    const board = [
      ['T', null, null, 'T'],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = createArrayGetter(board);
    // From col 3 going right wraps to col 0 (same value) → length ≥ 2
    const wrapped = findAlignmentInDirection(
      0,
      3,
      DIRECTIONS.HORIZONTAL,
      get,
      {
        rows: 4,
        cols: 4,
        targetLength: 2,
        wrap: true,
        directions: [DIRECTIONS.HORIZONTAL],
      }
    );
    expect(wrapped?.length).toBeGreaterThanOrEqual(2);

    // Place at (0,1): center + left T + wrapped right T → win of 3
    const winMove = checkMoveForWin(0, 1, 'T', get, {
      rows: 4,
      cols: 4,
      targetLength: 3,
      wrap: true,
    });
    expect(winMove.hasWinner).toBe(true);
  });

  it('countAlignmentPotential reports open vs blocked axes', () => {
    const board = [
      [null, 'X', null],
      ['O', 'X', 'O'],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const cfg: AlignmentConfig = {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: ALL_DIRECTIONS,
    };
    const pot = countAlignmentPotential(1, 1, 'X', get, cfg);
    expect(pot.get('vertical')?.count).toBeGreaterThanOrEqual(2);
    expect(pot.get('horizontal')?.blocked).toBe(true);
    expect(pot.size).toBe(ALL_DIRECTIONS.length);
  });

  it('createArrayGetter returns null out of bounds', () => {
    const get = createArrayGetter([['Q']]);
    expect(get(0, 0)).toBe('Q');
    expect(get(-1, 0)).toBeNull();
    expect(get(0, 1)).toBeNull();
  });
});
