/**
 * Wave 38 — findPath BFS stress / blocked corridors / same-cell.
 * Beyond wave 25 path edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findPath,
  areConnected,
  findRegionsForValue,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import type { ContiguousConfig, CellValue } from '../../src/core/alignment/types';

describe('Wave 38 contig-path — maze corridors', () => {
  const board: CellValue[][] = [
    ['P', 'P', 'P', null, 'P'],
    [null, null, 'P', null, 'P'],
    ['P', 'P', 'P', 'P', 'P'],
    ['P', null, null, null, null],
    ['P', 'P', 'P', 'P', 'P'],
  ];
  const get = createArrayGetter(board);
  const cfg: ContiguousConfig = { rows: 5, cols: 5 };

  it('path exists along connected P cells and is shortest BFS', () => {
    const path = findPath({ row: 0, col: 0 }, { row: 0, col: 4 }, get, cfg);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 0, col: 4 });
    // all steps same value
    for (const pos of path!) expect(get(pos.row, pos.col)).toBe('P');
    expect(areConnected({ row: 0, col: 0 }, { row: 0, col: 4 }, get, cfg)).toBe(
      true
    );
  });

  it('null start or mismatched values return null', () => {
    expect(findPath({ row: 0, col: 3 }, { row: 0, col: 4 }, get, cfg)).toBeNull();
    // plant an 'Q' temporarily via custom getter
    const mixed: CellValue[][] = board.map((row) => [...row]);
    mixed[4][4] = 'Q';
    const g2 = createArrayGetter(mixed);
    expect(findPath({ row: 0, col: 0 }, { row: 4, col: 4 }, g2, cfg)).toBeNull();
  });

  it('same cell path is singleton', () => {
    const path = findPath({ row: 2, col: 2 }, { row: 2, col: 2 }, get, cfg);
    expect(path).toEqual([{ row: 2, col: 2 }]);
  });

  it('regionsForValue P is a single blob on this maze', () => {
    const regions = findRegionsForValue('P', get, cfg);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBeGreaterThan(10);
  });
});

describe('Wave 38 contig-path — 8-connected shortcut', () => {
  it('diagonal-only link works with includeDiagonals', () => {
    const board: CellValue[][] = [
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ];
    const get = createArrayGetter(board);
    const four: ContiguousConfig = { rows: 3, cols: 3, includeDiagonals: false };
    const eight: ContiguousConfig = { rows: 3, cols: 3, includeDiagonals: true };
    expect(findPath({ row: 0, col: 0 }, { row: 2, col: 2 }, get, four)).toBeNull();
    const path = findPath({ row: 0, col: 0 }, { row: 2, col: 2 }, get, eight);
    expect(path).not.toBeNull();
    expect(path!).toHaveLength(3);
  });
});
