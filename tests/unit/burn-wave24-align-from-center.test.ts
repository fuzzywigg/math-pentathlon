/**
 * Wave 24 — findAlignmentFromCenter + checkMoveForWin.
 * Bidirectional runs and hypothetical move win checks.
 * Distinct from one-way findAlignmentInDirection. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentFromCenter,
  checkMoveForWin,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function setup(values: CellValue[][], targetLength = 3) {
  return {
    get: createArrayGetter(values),
    config: {
      rows: values.length,
      cols: values[0]?.length ?? 0,
      targetLength,
    } satisfies AlignmentConfig,
    board: values,
  };
}

describe('Wave 24 align-center — findAlignmentFromCenter', () => {
  it('returns null when center cell is empty', () => {
    const { get, config } = setup([
      ['X', null, 'X'],
      [null, null, null],
      [null, null, null],
    ]);
    expect(
      findAlignmentFromCenter(0, 1, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });

  it('extends both directions from middle of a three-in-a-row', () => {
    const { get, config } = setup([
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ]);
    const hit = findAlignmentFromCenter(
      0,
      1,
      DIRECTIONS.HORIZONTAL,
      get,
      config
    );
    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(3);
    expect(hit!.value).toBe('X');
    // Positions are sorted by row then col
    expect(hit!.positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
    expect(hit!.start).toEqual({ row: 0, col: 0 });
    expect(hit!.end).toEqual({ row: 0, col: 2 });
  });

  it('builds vertical from center with sorted positions', () => {
    const { get, config } = setup([
      [null, 'O', null],
      [null, 'O', null],
      [null, 'O', null],
    ]);
    const hit = findAlignmentFromCenter(1, 1, DIRECTIONS.VERTICAL, get, config);
    expect(hit?.length).toBe(3);
    expect(hit!.positions.map((p) => p.row)).toEqual([0, 1, 2]);
  });

  it('returns null when only two cells connected through center', () => {
    const { get, config } = setup([
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ]);
    expect(
      findAlignmentFromCenter(0, 0, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });

  it('stops at opponent on either side', () => {
    const { get, config } = setup([
      ['O', 'X', 'X', 'X', 'O'],
      [null, null, null, null, null],
    ]);
    const hit = findAlignmentFromCenter(0, 2, DIRECTIONS.HORIZONTAL, get, {
      rows: 2,
      cols: 5,
      targetLength: 3,
    });
    expect(hit?.length).toBe(3);
    expect(hit!.positions.every((p) => p.col >= 1 && p.col <= 3)).toBe(true);
  });

  it('wrap mode bridges across board edges from center', () => {
    const values: CellValue[][] = [
      ['X', null, null, 'X', 'X'],
      [null, null, null, null, null],
    ];
    const get = createArrayGetter(values);
    const config: AlignmentConfig = {
      rows: 2,
      cols: 5,
      targetLength: 3,
      wrap: true,
    };
    // Center at col 0: wrap negative to col4 X and positive to... null then stop?
    // From col 0: +dir empty, -dir wraps to col4 X then col3 X → positions X@0, X@4, X@3
    const hit = findAlignmentFromCenter(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      config
    );
    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(3);
  });
});

describe('Wave 24 align-center — checkMoveForWin hypothetical', () => {
  it('does not mutate the underlying board array', () => {
    const { get, config, board } = setup([
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ]);
    const snapshot = board.map((row) => [...row]);
    const result = checkMoveForWin(0, 2, 'X', get, config);
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('X');
    expect(board).toEqual(snapshot);
    expect(get(0, 2)).toBeNull();
  });

  it('returns no winner when move does not complete a line', () => {
    const { get, config } = setup([
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ]);
    const result = checkMoveForWin(0, 1, 'X', get, config);
    expect(result.hasWinner).toBe(false);
    expect(result.winner).toBeNull();
    expect(result.alignments).toEqual([]);
  });

  it('detects vertical win from a dropping move', () => {
    const { get, config } = setup([
      [null, null, null],
      ['O', null, null],
      ['O', null, null],
    ]);
    const result = checkMoveForWin(0, 0, 'O', get, config);
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('O');
    expect(result.alignments.length).toBeGreaterThanOrEqual(1);
  });

  it('detects diagonal win; opponent cells block', () => {
    const open = setup([
      [null, null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ]);
    expect(checkMoveForWin(0, 0, 'X', open.get, open.config).hasWinner).toBe(
      true
    );

    const blocked = setup([
      [null, null, null],
      [null, 'O', null],
      [null, null, 'X'],
    ]);
    expect(
      checkMoveForWin(0, 0, 'X', blocked.get, blocked.config).hasWinner
    ).toBe(false);
  });

  it('honors directions restriction on win check', () => {
    const { get, config } = setup([
      [null, null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ]);
    const horizOnly = checkMoveForWin(0, 0, 'X', get, {
      ...config,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(horizOnly.hasWinner).toBe(false);

    const withDiag = checkMoveForWin(0, 0, 'X', get, {
      ...config,
      directions: [DIRECTIONS.DIAGONAL_DOWN],
    });
    expect(withDiag.hasWinner).toBe(true);
  });

  it('connect-four targetLength 4 win on bottom row', () => {
    const { get, config } = setup(
      [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['X', 'X', 'X', null, null],
      ],
      4
    );
    const miss = checkMoveForWin(3, 4, 'X', get, config);
    expect(miss.hasWinner).toBe(false);
    const win = checkMoveForWin(3, 3, 'X', get, config);
    expect(win.hasWinner).toBe(true);
    expect(win.winner).toBe('X');
  });
});
