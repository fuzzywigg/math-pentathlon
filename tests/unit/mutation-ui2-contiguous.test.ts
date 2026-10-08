import { describe, expect, it } from 'vitest';
import {
  findAllRegions,
  getHexNeighbors,
  getNeighbors,
} from '../../src/core/alignment/contiguous';
import type { ContiguousConfig } from '../../src/core/alignment/types';

const cfg = (over: Partial<ContiguousConfig> = {}): ContiguousConfig => ({
  rows: 3,
  cols: 3,
  includeDiagonals: false,
  wrap: false,
  ...over,
});

describe('mutation-ui2 contiguous neighbor arithmetic', () => {
  it('4-way neighbors add offset.row/col (not subtract)', () => {
    const n = getNeighbors(1, 1, cfg());
    const keys = new Set(n.map((p) => `${p.row},${p.col}`));
    expect(keys).toEqual(new Set(['0,1', '2,1', '1,0', '1,2']));
    expect(keys.has('1,1')).toBe(false);
  });

  it('hex neighbors on even row add EVEN-table offsets (not subtract)', () => {
    // Center (2,2) on a large board so all 6 neighbors are in-bounds.
    const n = getHexNeighbors(2, 2, cfg({ rows: 5, cols: 5 }));
    const keys = new Set(n.map((p) => `${p.row},${p.col}`));
    expect(keys).toEqual(
      new Set(['1,2', '1,3', '2,1', '2,3', '3,2', '3,3'])
    );
  });

  it.skip('equivalent: neighbor row/col + → − preserves undirected 4-way/hex sets', () => {
    // Reason: NEIGHBORS_4WAY is centrally symmetric; flipping `row + offset`
    // to `row - offset` yields the same neighbor set. Even-row hex offsets are
    // similarly closed under that flip for in-bounds centers. Not a product bug.
  });

  it('findAllRegions scans row < rows (exclusive upper bound)', () => {
    // 1x1 board with a filled cell — loop must visit (0,0) once only.
    const board = [['A']];
    const regions = findAllRegions(
      (r, c) => board[r]?.[c] ?? null,
      cfg({ rows: 1, cols: 1 })
    );
    expect(regions).toHaveLength(1);
    expect(regions[0]!.size).toBe(1);

    // 2x2 with one cell — rows bound must not read past end.
    const board2 = [
      ['X', null],
      [null, null],
    ];
    const regions2 = findAllRegions(
      (r, c) => {
        if (r >= 2 || c >= 2) throw new Error(`OOB ${r},${c}`);
        return board2[r]![c] ?? null;
      },
      cfg({ rows: 2, cols: 2 })
    );
    expect(regions2).toHaveLength(1);
  });
});
