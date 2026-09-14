/**
 * Wave 24 — findAlignmentInDirection edge cases.
 * Raw grid-alignment API (compat shadows barrel names). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentInDirection,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function board(values: CellValue[][]): {
  get: ReturnType<typeof createArrayGetter>;
  config: AlignmentConfig;
} {
  return {
    get: createArrayGetter(values),
    config: {
      rows: values.length,
      cols: values[0]?.length ?? 0,
      targetLength: 3,
    },
  };
}

describe('Wave 24 align-direction — null / short / exact / overshoot', () => {
  it('returns null when start cell is empty', () => {
    const { get, config } = board([
      [null, 'X', 'X'],
      ['X', 'X', 'X'],
      [null, null, null],
    ]);
    expect(
      findAlignmentInDirection(0, 0, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });

  it('returns null for short run below targetLength', () => {
    const { get, config } = board([
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ]);
    expect(
      findAlignmentInDirection(0, 0, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });

  it('returns exact-length horizontal alignment', () => {
    const { get, config } = board([
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ]);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      config
    );
    expect(hit).not.toBeNull();
    expect(hit!.value).toBe('X');
    expect(hit!.length).toBe(3);
    expect(hit!.direction.name).toBe('horizontal');
    expect(hit!.positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
    expect(hit!.start).toEqual({ row: 0, col: 0 });
    expect(hit!.end).toEqual({ row: 0, col: 2 });
  });

  it('stops at opponent and does not overshoot into wrong value', () => {
    const { get, config } = board([
      ['X', 'X', 'O', 'X'],
      [null, null, null, null],
    ]);
    expect(
      findAlignmentInDirection(0, 0, DIRECTIONS.HORIZONTAL, get, {
        ...config,
        cols: 4,
        targetLength: 3,
      })
    ).toBeNull();
  });

  it('accepts runs longer than targetLength (stops at target)', () => {
    const values: CellValue[][] = [['X', 'X', 'X', 'X', 'X']];
    const get = createArrayGetter(values);
    const config: AlignmentConfig = {
      rows: 1,
      cols: 5,
      targetLength: 3,
    };
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.HORIZONTAL,
      get,
      config
    );
    expect(hit).not.toBeNull();
    // Implementation collects until length >= targetLength
    expect(hit!.length).toBeGreaterThanOrEqual(3);
    expect(hit!.length).toBeLessThanOrEqual(5);
  });
});

describe('Wave 24 align-direction — vertical / diagonal / edge break', () => {
  it('finds vertical column of three', () => {
    const { get, config } = board([
      ['O', null, null],
      ['O', null, null],
      ['O', null, null],
    ]);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.VERTICAL,
      get,
      config
    );
    expect(hit?.value).toBe('O');
    expect(hit?.positions.map((p) => p.row)).toEqual([0, 1, 2]);
  });

  it('finds diagonal-down', () => {
    const { get, config } = board([
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ]);
    const hit = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.DIAGONAL_DOWN,
      get,
      config
    );
    expect(hit?.length).toBe(3);
    expect(hit?.direction.name).toBe('diagonal-down');
  });

  it('finds diagonal-up from bottom-left', () => {
    const { get, config } = board([
      [null, null, 'X'],
      [null, 'X', null],
      ['X', null, null],
    ]);
    const hit = findAlignmentInDirection(
      2,
      0,
      DIRECTIONS.DIAGONAL_UP,
      get,
      config
    );
    expect(hit?.length).toBe(3);
    expect(hit?.direction.name).toBe('diagonal-up');
  });

  it('breaks at hard edge without wrap', () => {
    const { get, config } = board([
      [null, 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ]);
    // Start near right edge looking horizontal — only 2 cells available
    expect(
      findAlignmentInDirection(0, 1, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });
});

describe('Wave 24 align-direction — wrap mode', () => {
  it('wraps horizontal alignment across board edge', () => {
    const values: CellValue[][] = [
      ['X', null, 'X', 'X'],
      [null, null, null, null],
    ];
    const get = createArrayGetter(values);
    const config: AlignmentConfig = {
      rows: 2,
      cols: 4,
      targetLength: 3,
      wrap: true,
    };
    // From col 2: X,X then wrap to col 0 X
    const hit = findAlignmentInDirection(
      0,
      2,
      DIRECTIONS.HORIZONTAL,
      get,
      config
    );
    expect(hit).not.toBeNull();
    expect(hit!.length).toBe(3);
    expect(hit!.positions.some((p) => p.col === 0)).toBe(true);
  });

  it('wrap false still fails across edge', () => {
    const values: CellValue[][] = [
      ['X', null, 'X', 'X'],
      [null, null, null, null],
    ];
    const get = createArrayGetter(values);
    const config: AlignmentConfig = {
      rows: 2,
      cols: 4,
      targetLength: 3,
      wrap: false,
    };
    expect(
      findAlignmentInDirection(0, 2, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });
});
