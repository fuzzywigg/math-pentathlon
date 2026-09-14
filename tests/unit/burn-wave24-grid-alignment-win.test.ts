/**
 * Wave 24 — grid-alignment win / center / potential APIs.
 * Complements burn-wave24-grid-alignment-core (direction scans + collections).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
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
  type CellValue,
} from '../../src/core/alignment/types';

const cfg = (
  overrides: Partial<AlignmentConfig> & Pick<AlignmentConfig, 'rows' | 'cols'>
): AlignmentConfig => ({
  targetLength: 3,
  directions: ALL_DIRECTIONS,
  wrap: false,
  ...overrides,
});

describe('Wave 24 grid-alignment — checkForWinner', () => {
  it('reports no winner on empty / incomplete boards', () => {
    const empty: CellValue[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    const noWin = checkForWinner(
      createArrayGetter(empty),
      cfg({ rows: 3, cols: 3 })
    );
    expect(noWin.hasWinner).toBe(false);
    expect(noWin.winner).toBeNull();
    expect(noWin.alignments).toEqual([]);

    const partial: CellValue[][] = [
      ['X', 'X', null],
      [null, 'O', null],
      [null, null, 'O'],
    ];
    expect(
      checkForWinner(createArrayGetter(partial), cfg({ rows: 3, cols: 3 }))
        .hasWinner
    ).toBe(false);
  });

  it('detects winner and returns alignments', () => {
    const board: CellValue[][] = [
      ['X', 'O', null],
      ['X', 'O', null],
      ['X', null, null],
    ];
    const result = checkForWinner(
      createArrayGetter(board),
      cfg({ rows: 3, cols: 3 })
    );
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('X');
    expect(result.alignments.length).toBeGreaterThanOrEqual(1);
    expect(result.alignments[0].value).toBe('X');
  });
});

describe('Wave 24 grid-alignment — findAlignmentFromCenter', () => {
  it('returns null for empty center or short span', () => {
    const board: CellValue[][] = [
      [null, 'X', null],
      ['X', null, 'X'],
      [null, 'X', null],
    ];
    const get = createArrayGetter(board);
    const config = cfg({ rows: 3, cols: 3 });
    expect(
      findAlignmentFromCenter(1, 1, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
    expect(
      findAlignmentFromCenter(0, 1, DIRECTIONS.VERTICAL, get, config)
    ).toBeNull();
  });

  it('extends both ways and sorts positions', () => {
    const board: CellValue[][] = [
      [null, null, null, null, null],
      [null, 'X', 'X', 'X', null],
      [null, null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentFromCenter(
      1,
      2,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 3, cols: 5, targetLength: 3 })
    );
    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(3);
    expect(hit!.start).toEqual({ row: 1, col: 1 });
    expect(hit!.end).toEqual({ row: 1, col: 3 });
    expect(hit!.positions).toEqual([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ]);
  });

  it('wraps toroidal boards when extending from center', () => {
    const board: CellValue[][] = [
      ['X', null, 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentFromCenter(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 3, cols: 3, targetLength: 2, wrap: true })
    );
    expect(hit?.length).toBe(2);
    expect(hit?.value).toBe('X');
  });
});

describe('Wave 24 grid-alignment — checkMoveForWin', () => {
  it('hypothetical move does not mutate board getter cells', () => {
    const board: CellValue[][] = [
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const before = get(0, 2);
    const result = checkMoveForWin(
      0,
      2,
      'X',
      get,
      cfg({ rows: 3, cols: 3, targetLength: 3 })
    );
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('X');
    expect(get(0, 2)).toBe(before);
    expect(board[0][2]).toBeNull();
  });

  it('returns no win when move does not complete targetLength', () => {
    const board: CellValue[][] = [
      ['X', null, null],
      [null, 'O', null],
      [null, null, null],
    ];
    const result = checkMoveForWin(
      0,
      1,
      'X',
      createArrayGetter(board),
      cfg({ rows: 3, cols: 3 })
    );
    expect(result.hasWinner).toBe(false);
    expect(result.winner).toBeNull();
    expect(result.alignments).toEqual([]);
  });

  it('detects diagonal win from a center drop', () => {
    const board: CellValue[][] = [
      ['X', null, null],
      [null, null, null],
      [null, null, 'X'],
    ];
    const result = checkMoveForWin(
      1,
      1,
      'X',
      createArrayGetter(board),
      cfg({ rows: 3, cols: 3, targetLength: 3 })
    );
    expect(result.hasWinner).toBe(true);
    expect(result.alignments.some((a) => a.length >= 3)).toBe(true);
  });
});

describe('Wave 24 grid-alignment — countAlignmentPotential', () => {
  it('counts open runs and marks blocked when both sides closed', () => {
    const board: CellValue[][] = [
      ['O', 'X', 'X', 'X', 'O'],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ];
    const potential = countAlignmentPotential(
      0,
      2,
      'X',
      createArrayGetter(board),
      cfg({ rows: 3, cols: 5, targetLength: 3 })
    );

    const horiz = potential.get('horizontal');
    expect(horiz).toBeDefined();
    expect(horiz!.count).toBe(3);
    expect(horiz!.blocked).toBe(true);

    const vert = potential.get('vertical');
    expect(vert).toBeDefined();
    expect(vert!.count).toBe(1);
    expect(vert!.blocked).toBe(false);
  });

  it('stops at empty cells without marking blocked', () => {
    const board: CellValue[][] = [
      [null, 'X', null],
      [null, 'X', null],
      [null, null, null],
    ];
    const potential = countAlignmentPotential(
      0,
      1,
      'X',
      createArrayGetter(board),
      cfg({ rows: 3, cols: 3 })
    );
    const vert = potential.get('vertical');
    expect(vert!.count).toBe(2);
    expect(vert!.blocked).toBe(false);
  });

  it('treats board edges as blocking in the edge-facing direction', () => {
    const board: CellValue[][] = [
      ['X', null],
      [null, null],
    ];
    const potential = countAlignmentPotential(
      0,
      0,
      'X',
      createArrayGetter(board),
      cfg({
        rows: 2,
        cols: 2,
        directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL],
      })
    );
    // At corner: negative horiz/vert are OOB → blockedPositive or blockedNegative
    // blocked flag requires BOTH sides blocked
    const horiz = potential.get('horizontal');
    expect(horiz!.count).toBe(1);
    expect(horiz!.blocked).toBe(false); // positive side is open (null)

    const fullBlocked: CellValue[][] = [['O', 'X', 'O']];
    const blocked = countAlignmentPotential(
      0,
      1,
      'X',
      createArrayGetter(fullBlocked),
      cfg({
        rows: 1,
        cols: 3,
        directions: [DIRECTIONS.HORIZONTAL],
      })
    );
    expect(blocked.get('horizontal')!.blocked).toBe(true);
    expect(blocked.get('horizontal')!.count).toBe(1);
  });

  it('wrap mode continues counting across edges', () => {
    const board: CellValue[][] = [
      ['X', null, 'X'],
      [null, null, null],
    ];
    const potential = countAlignmentPotential(
      0,
      0,
      'X',
      createArrayGetter(board),
      cfg({
        rows: 2,
        cols: 3,
        wrap: true,
        directions: [DIRECTIONS.HORIZONTAL],
      })
    );
    expect(potential.get('horizontal')!.count).toBe(2);
  });
});
