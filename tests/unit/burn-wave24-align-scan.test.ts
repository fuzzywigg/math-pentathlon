/**
 * Wave 24 — findAlignmentsForValue / findAllAlignments / checkForWinner.
 * Board-wide scan APIs on raw grid-alignment. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentsForValue,
  findAllAlignments,
  checkForWinner,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function setup(
  values: CellValue[][],
  targetLength = 3,
  directions?: AlignmentConfig['directions']
) {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    get: createArrayGetter(values),
    config: {
      rows,
      cols,
      targetLength,
      ...(directions ? { directions } : {}),
    } satisfies AlignmentConfig,
  };
}

describe('Wave 24 align-scan — findAlignmentsForValue', () => {
  it('returns empty on empty board', () => {
    const { get, config } = setup([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    expect(findAlignmentsForValue('X', get, config)).toEqual([]);
  });

  it('filters by value and ignores opponent lines', () => {
    const { get, config } = setup([
      ['X', 'X', 'X'],
      ['O', 'O', 'O'],
      [null, null, null],
    ]);
    const xs = findAlignmentsForValue('X', get, config);
    const os = findAlignmentsForValue('O', get, config);
    expect(xs.length).toBeGreaterThanOrEqual(1);
    expect(xs.every((a) => a.value === 'X')).toBe(true);
    expect(os.length).toBeGreaterThanOrEqual(1);
    expect(os.every((a) => a.value === 'O')).toBe(true);
  });

  it('dedupes the same line discovered from multiple start cells', () => {
    const { get, config } = setup([
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ]);
    const hits = findAlignmentsForValue('X', get, {
      ...config,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    // Without dedupe, col0 and col1 starts could both report the line
    expect(hits.length).toBe(1);
    expect(hits[0].positions).toHaveLength(3);
  });

  it('respects restricted directions (no false diagonals)', () => {
    const { get, config } = setup([
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ]);
    const horizOnly = findAlignmentsForValue('X', get, {
      ...config,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(horizOnly).toEqual([]);

    const withDiag = findAlignmentsForValue('X', get, {
      ...config,
      directions: [DIRECTIONS.DIAGONAL_DOWN],
    });
    expect(withDiag.length).toBe(1);
  });
});

describe('Wave 24 align-scan — findAllAlignments multi-line', () => {
  it('finds both horizontal and vertical on a cross board', () => {
    const { get, config } = setup([
      [null, 'X', null],
      ['X', 'X', 'X'],
      [null, 'X', null],
    ]);
    // Center row is 3-in-a-row; vertical through center is only 3 if col1 filled
    // board already has vertical X at (0,1)(1,1)(2,1)
    const all = findAllAlignments(get, config);
    expect(all.length).toBeGreaterThanOrEqual(2);
    const names = new Set(all.map((a) => a.direction.name));
    expect(names.has('horizontal')).toBe(true);
    expect(names.has('vertical')).toBe(true);
  });

  it('returns empty when no line reaches targetLength', () => {
    // Scattered pieces — no 3-in-a-row in any direction (avoid X diagonals)
    const { get, config } = setup([
      ['X', 'O', null],
      ['O', null, 'X'],
      [null, 'X', 'O'],
    ]);
    expect(findAllAlignments(get, config)).toEqual([]);
  });

  it('supports targetLength 4 connect-four style', () => {
    const { get, config } = setup(
      [
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['X', 'X', 'X', 'X', null],
        [null, null, null, null, null],
      ],
      4
    );
    const all = findAllAlignments(get, config);
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all[0].length).toBeGreaterThanOrEqual(4);
    expect(all[0].value).toBe('X');
  });
});

describe('Wave 24 align-scan — checkForWinner', () => {
  it('hasWinner false and winner null on empty / mixed boards', () => {
    const empty = setup([
      [null, null],
      [null, null],
    ]);
    expect(
      checkForWinner(empty.get, { ...empty.config, targetLength: 2 })
    ).toEqual({
      hasWinner: false,
      winner: null,
      alignments: [],
    });

    const mixed = setup([
      ['X', 'O', null],
      ['O', 'X', null],
      [null, null, null],
    ]);
    const noWin = checkForWinner(mixed.get, mixed.config);
    expect(noWin.hasWinner).toBe(false);
    expect(noWin.winner).toBeNull();
    expect(noWin.alignments).toEqual([]);
  });

  it('reports first alignment value as winner', () => {
    const { get, config } = setup([
      ['O', 'O', 'O'],
      [null, null, null],
      [null, null, null],
    ]);
    const result = checkForWinner(get, config);
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('O');
    expect(result.alignments.length).toBeGreaterThanOrEqual(1);
    expect(result.alignments[0].value).toBe('O');
  });

  it('numeric cell values work as winners', () => {
    const { get, config } = setup([
      [7, 7, 7],
      [null, null, null],
      [null, null, null],
    ]);
    const result = checkForWinner(get, config);
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe(7);
  });
});
