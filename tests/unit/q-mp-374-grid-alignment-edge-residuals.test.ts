/**
 * q-mp-374 — Characterize grid-alignment edge residuals (tests-only).
 *
 * Pins CURRENT tip behavior for `src/core/alignment/grid-alignment.ts`
 * edge / matrix / empty-board paths that surround the five
 * `no-non-null-assertion` sites queued for q-mp-367:
 *   findAlignmentInDirection  :94,:95   (start/end = positions[0]/last)
 *   checkForWinner            :207      (winner = alignments[0]!.value)
 *   findAlignmentFromCenter   :331,:332 (start/end after sort)
 *
 * Prerequisite characterization for the nnnull clear — does NOT edit
 * grid-alignment.ts, rules.ts, AI, scoring, or player-facing copy.
 * Structural asserts only; no new copy pins.
 */
import { describe, expect, it } from 'vitest';

import {
  checkForWinner,
  checkMoveForWin,
  countAlignmentPotential,
  createArrayGetter,
  findAlignmentFromCenter,
  findAlignmentInDirection,
  findAlignmentsForValue,
  findAllAlignments,
  isInBounds,
  wrapPosition,
} from '../../src/core/alignment/grid-alignment';
import {
  ALL_DIRECTIONS,
  DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function cfg(
  overrides: Partial<AlignmentConfig> & Pick<AlignmentConfig, 'rows' | 'cols'>
): AlignmentConfig {
  return {
    targetLength: 3,
    directions: ALL_DIRECTIONS,
    wrap: false,
    ...overrides,
  };
}

/** Board getter that yields `undefined` (not null) for empty / OOB cells. */
function undefGetter(board: (CellValue | undefined)[][]) {
  return (row: number, col: number): CellValue | undefined => {
    if (row < 0 || col < 0 || row >= board.length) {
      return undefined;
    }
    const boardRow = board[row];
    if (!boardRow || col >= boardRow.length) {
      return undefined;
    }
    return boardRow[col];
  };
}

describe('q-mp-374 grid-alignment — empty-board residuals', () => {
  it('empty null board: no alignments, checkForWinner skips alignments[0]! path', () => {
    const board: CellValue[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const config = cfg({ rows: 3, cols: 3 });

    expect(findAllAlignments(get, config)).toEqual([]);
    expect(findAlignmentsForValue('X', get, config)).toEqual([]);

    const result = checkForWinner(get, config);
    expect(result.hasWinner).toBe(false);
    expect(result.winner).toBeNull();
    expect(result.alignments).toEqual([]);
    // alignments.length === 0 → L196–201 early return; L207 never runs.
    expect(result.alignments[0]).toBeUndefined();
  });

  it('empty undefined board: soft-empty treated like null (no winner)', () => {
    const board: (CellValue | undefined)[][] = [
      [undefined, undefined],
      [undefined, undefined],
    ];
    const get = undefGetter(board);
    const config = cfg({ rows: 2, cols: 2, targetLength: 2 });

    expect(findAllAlignments(get, config)).toEqual([]);
    const result = checkForWinner(get, config);
    expect(result).toEqual({
      hasWinner: false,
      winner: null,
      alignments: [],
    });
  });

  it('0×0 board matrix: bounds false, wrap identity, no scan iterations', () => {
    const get = createArrayGetter([]);
    const config = cfg({ rows: 0, cols: 0, targetLength: 1 });

    expect(isInBounds(0, 0, 0, 0)).toBe(false);
    expect(wrapPosition(0, 0, 1, 1)).toEqual({ row: 0, col: 0 });
    expect(findAllAlignments(get, config)).toEqual([]);
    expect(checkForWinner(get, config).hasWinner).toBe(false);
  });
});

describe('q-mp-374 grid-alignment — nnnull :94/:95 findAlignmentInDirection start/end', () => {
  it('exact targetLength: start/end equal positions[0]/last (sites :94/:95)', () => {
    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 3, cols: 3, targetLength: 3 })
    );

    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(3);
    expect(hit!.positions.length).toBeGreaterThanOrEqual(3);
    // Structural pin for q-mp-367 rewrite of positions[0]! / last!
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[hit!.positions.length - 1]);
    expect(hit!.start).toEqual({ row: 0, col: 0 });
    expect(hit!.end).toEqual({ row: 0, col: 2 });
  });

  it('targetLength 1: singleton still populates start===end via same ! sites', () => {
    const board: CellValue[][] = [
      ['O', null],
      [null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 2, cols: 2, targetLength: 1 })
    );

    expect(hit).not.toBeNull();
    expect(hit!.positions).toEqual([{ row: 0, col: 0 }]);
    expect(hit!.start).toEqual(hit!.end);
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[hit!.positions.length - 1]);
  });

  it('over-length run: length stops at targetLength; start/end still bookend positions', () => {
    // findAlignmentInDirection stops once positions.length === targetLength
    const board: CellValue[][] = [
      ['X', 'X', 'X', 'X'],
      [null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 2, cols: 4, targetLength: 3 })
    );

    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(3);
    expect(hit!.positions).toHaveLength(3);
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[2]);
  });

  it('undefined mid-cell breaks run before nnnull return (nullish soft edge)', () => {
    const board: (CellValue | undefined)[][] = [
      ['X', undefined, 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = undefGetter(board);
    expect(
      findAlignmentInDirection(
        0,
        0,
        DIRECTIONS.HORIZONTAL,
        get,
        cfg({ rows: 3, cols: 3, targetLength: 3 })
      )
    ).toBeNull();
  });

  it('wrap edge: toroidal horizontal yields start/end bookends without OOB break', () => {
    const board: CellValue[][] = [
      ['X', null, 'X'],
      [null, null, null],
      [null, null, null],
    ];
    // Start at col 2 → wrap to col 0 for third cell → length 3 with wrap
    const boardFull: CellValue[][] = [
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(boardFull);
    const hit = findAlignmentInDirection(
      0,
      1,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 3, cols: 3, targetLength: 3, wrap: true })
    );
    expect(hit).not.toBeNull();
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[hit!.positions.length - 1]);
    // Non-wrap from mid with gap board stays short
    expect(
      findAlignmentInDirection(
        0,
        0,
        DIRECTIONS.HORIZONTAL,
        createArrayGetter(board),
        cfg({ rows: 3, cols: 3, targetLength: 3, wrap: false })
      )
    ).toBeNull();
  });
});

describe('q-mp-374 grid-alignment — nnnull :207 checkForWinner alignments[0]', () => {
  it('single win: winner equals alignments[0].value (site :207)', () => {
    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      [null, 'O', null],
      [null, null, 'O'],
    ];
    const get = createArrayGetter(board);
    const result = checkForWinner(get, cfg({ rows: 3, cols: 3 }));

    expect(result.hasWinner).toBe(true);
    expect(result.alignments.length).toBeGreaterThan(0);
    expect(result.winner).toBe(result.alignments[0]!.value);
    expect(result.winner).toBe('X');
  });

  it('multi-alignment matrix: winner is first discovered alignment value', () => {
    // Full board of X → many alignments; scan order is row-major then ALL_DIRECTIONS
    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      ['X', 'X', 'X'],
      ['X', 'X', 'X'],
    ];
    const get = createArrayGetter(board);
    const result = checkForWinner(
      get,
      cfg({
        rows: 3,
        cols: 3,
        targetLength: 3,
        directions: [DIRECTIONS.HORIZONTAL],
      })
    );

    expect(result.hasWinner).toBe(true);
    expect(result.alignments.length).toBeGreaterThanOrEqual(3);
    expect(result.winner).toBe(result.alignments[0]!.value);
    expect(result.alignments.every((a) => a.value === result.winner)).toBe(
      true
    );
    // First hit is top-row horizontal starting at (0,0)
    expect(result.alignments[0]!.start).toEqual({ row: 0, col: 0 });
  });

  it('opposing values present but only one reaches targetLength', () => {
    const board: CellValue[][] = [
      ['O', 'O', null],
      ['X', 'X', 'X'],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const result = checkForWinner(get, cfg({ rows: 3, cols: 3 }));
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('X');
    expect(result.winner).toBe(result.alignments[0]!.value);
  });
});

describe('q-mp-374 grid-alignment — nnnull :331/:332 findAlignmentFromCenter start/end', () => {
  it('bidirectional exact length: sorted start/end match positions bookends', () => {
    const board: CellValue[][] = [
      [null, null, null],
      ['X', 'X', 'X'],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const hit = findAlignmentFromCenter(
      1,
      1,
      DIRECTIONS.HORIZONTAL,
      get,
      cfg({ rows: 3, cols: 3, targetLength: 3 })
    );

    expect(hit).not.toBeNull();
    expect(hit!.positions).toHaveLength(3);
    // fromCenter sorts by row then col before assigning start/end
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[hit!.positions.length - 1]);
    expect(hit!.start).toEqual({ row: 1, col: 0 });
    expect(hit!.end).toEqual({ row: 1, col: 2 });
  });

  it('vertical over-length from center: start is min row, end is max row', () => {
    const board: CellValue[][] = [['O'], ['O'], ['O'], ['O']];
    const get = createArrayGetter(board);
    const hit = findAlignmentFromCenter(
      1,
      0,
      DIRECTIONS.VERTICAL,
      get,
      cfg({ rows: 4, cols: 1, targetLength: 3 })
    );

    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(4);
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[hit!.positions.length - 1]);
    expect(hit!.start.row).toBeLessThan(hit!.end.row);
  });

  it('empty center / short run: returns null (no :331/:332 assignment)', () => {
    const board: CellValue[][] = [
      [null, 'X', null],
      [null, null, null],
      [null, 'X', null],
    ];
    const get = createArrayGetter(board);
    const config = cfg({ rows: 3, cols: 3, targetLength: 3 });

    expect(
      findAlignmentFromCenter(0, 0, DIRECTIONS.VERTICAL, get, config)
    ).toBeNull();
    expect(
      findAlignmentFromCenter(0, 1, DIRECTIONS.VERTICAL, get, config)
    ).toBeNull();
  });

  it('undefined center soft-fails like null before collecting positions', () => {
    const board: (CellValue | undefined)[][] = [
      [undefined, 'X', 'X'],
      [undefined, undefined, undefined],
    ];
    const get = undefGetter(board);
    expect(
      findAlignmentFromCenter(
        0,
        0,
        DIRECTIONS.HORIZONTAL,
        get,
        cfg({ rows: 2, cols: 3, targetLength: 2 })
      )
    ).toBeNull();
  });

  it('wrap from center: toroidal vertical bookends survive sort', () => {
    const board: CellValue[][] = [
      ['X', null],
      [null, null],
      ['X', null],
      ['X', null],
    ];
    const get = createArrayGetter(board);
    // Center at (0,0); +vertical wraps to row 3 then 2 → three X with wrap
    const hit = findAlignmentFromCenter(
      0,
      0,
      DIRECTIONS.VERTICAL,
      get,
      cfg({ rows: 4, cols: 2, targetLength: 3, wrap: true })
    );
    expect(hit).not.toBeNull();
    expect(hit!.length).toBeGreaterThanOrEqual(3);
    expect(hit!.start).toEqual(hit!.positions[0]);
    expect(hit!.end).toEqual(hit!.positions[hit!.positions.length - 1]);
  });
});

describe('q-mp-374 grid-alignment — matrix / getter / move residuals', () => {
  it('createArrayGetter: jagged row + missing row → null (no throw)', () => {
    const jagged: CellValue[][] = [['A', 'B'], ['C']];
    const get = createArrayGetter(jagged);
    expect(get(0, 0)).toBe('A');
    expect(get(0, 1)).toBe('B');
    expect(get(1, 0)).toBe('C');
    expect(get(1, 1)).toBeNull(); // past short row
    expect(get(2, 0)).toBeNull(); // missing row
    expect(get(-1, 0)).toBeNull();
    expect(get(0, -1)).toBeNull();
  });

  it('checkMoveForWin empty board: placing completes a row; miss leaves no winner', () => {
    const empty: CellValue[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(empty);
    const config = cfg({ rows: 3, cols: 3 });

    const miss = checkMoveForWin(1, 1, 'X', get, config);
    expect(miss.hasWinner).toBe(false);
    expect(miss.winner).toBeNull();
    expect(miss.alignments).toEqual([]);

    const near: CellValue[][] = [
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ];
    const win = checkMoveForWin(0, 2, 'X', createArrayGetter(near), config);
    expect(win.hasWinner).toBe(true);
    expect(win.winner).toBe('X');
    expect(win.alignments.length).toBeGreaterThan(0);
    for (const a of win.alignments) {
      expect(a.start).toEqual(a.positions[0]);
      expect(a.end).toEqual(a.positions[a.positions.length - 1]);
    }
  });

  it('countAlignmentPotential: null and undefined both open; opponent blocks', () => {
    const board: (CellValue | undefined)[][] = [
      ['O', 'X', undefined],
      [null, 'X', 'X'],
      ['O', null, null],
    ];
    const get = undefGetter(board);
    const potential = countAlignmentPotential(
      1,
      1,
      'X',
      get,
      cfg({
        rows: 3,
        cols: 3,
        directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL],
      })
    );

    const horiz = potential.get('horizontal');
    expect(horiz).toBeDefined();
    expect(horiz!.count).toBeGreaterThanOrEqual(2);
    // positive → undefined open (not blocked); negative → O blocks
    expect(horiz!.blocked).toBe(false);

    const vert = potential.get('vertical');
    expect(vert).toBeDefined();
    // positive null open; negative O blocks → not both blocked
    expect(vert!.blocked).toBe(false);
  });

  it('findAlignmentsForValue empty vs occupied matrix', () => {
    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      ['O', null, 'O'],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const config = cfg({ rows: 3, cols: 3 });

    const xs = findAlignmentsForValue('X', get, config);
    expect(xs.length).toBeGreaterThanOrEqual(1);
    expect(xs.every((a) => a.value === 'X')).toBe(true);
    for (const a of xs) {
      expect(a.start).toEqual(a.positions[0]);
      expect(a.end).toEqual(a.positions[a.positions.length - 1]);
    }

    expect(findAlignmentsForValue('O', get, config)).toEqual([]);
    expect(findAlignmentsForValue('Z', get, config)).toEqual([]);
  });
});
