/**
 * Wave 25 — findRegion flood-fill edges on raw contiguous.ts.
 * Distinct from wave 21 smoke and compat findRegionAt wrappers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  findRegion,
  getNeighbors,
  getHexNeighbors,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  GridPosition,
} from '../../src/core/alignment/types';

function grid(values: (CellValue | null | undefined)[][]): {
  getCell: CellGetter;
  config: ContiguousConfig;
} {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      const v = values[r][c];
      return v === undefined ? null : v;
    },
  };
}

describe('Wave 25 contig-find-region — null / empty starts', () => {
  it('returns null on null cell', () => {
    const { getCell, config } = grid([
      [null, 'A'],
      ['A', 'A'],
    ]);
    expect(findRegion(0, 0, getCell, config)).toBeNull();
  });

  it('returns null on undefined cell (treated empty)', () => {
    const values: (CellValue | null | undefined)[][] = [
      [undefined, 'X'],
      ['X', 'X'],
    ];
    const { getCell, config } = grid(values);
    expect(findRegion(0, 0, getCell, config)).toBeNull();
  });

  it('returns null when start is out of board via empty getter', () => {
    const getCell: CellGetter = () => null;
    expect(findRegion(9, 9, getCell, { rows: 2, cols: 2 })).toBeNull();
  });
});

describe('Wave 25 contig-find-region — single cell and flood', () => {
  it('single occupied cell is a size-1 region', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, 'Q'],
    ]);
    const region = findRegion(1, 1, getCell, config);
    expect(region).toEqual({
      value: 'Q',
      size: 1,
      positions: [{ row: 1, col: 1 }],
    });
  });

  it('floods 4-connected same-value blob and stops at blockers', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'B'],
      ['R', null, 'B'],
      ['R', 'B', 'B'],
    ]);
    const red = findRegion(0, 0, getCell, config)!;
    expect(red.value).toBe('R');
    expect(red.size).toBe(4);
    expect(red.positions).toHaveLength(4);
    expect(
      red.positions.every((p) => getCell(p.row, p.col) === 'R')
    ).toBe(true);

    const blue = findRegion(0, 2, getCell, config)!;
    expect(blue.value).toBe('B');
    expect(blue.size).toBe(4);
  });

  it('does not cross diagonally under default 4-connectivity', () => {
    const { getCell, config } = grid([
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(region.size).toBe(1);
  });

  it('includeDiagonals merges diagonal chain into one region', () => {
    const { getCell, config } = grid([
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ]);
    const diagConfig: ContiguousConfig = {
      ...config,
      includeDiagonals: true,
    };
    const region = findRegion(0, 0, getCell, diagConfig)!;
    expect(region.size).toBe(3);
  });

  it('numeric and string values are distinct (no coercion)', () => {
    const { getCell, config } = grid([
      [1, '1'],
      [1, 1],
    ]);
    const num = findRegion(0, 0, getCell, config)!;
    expect(num.size).toBe(3);
    expect(num.value).toBe(1);

    const str = findRegion(0, 1, getCell, config)!;
    expect(str.size).toBe(1);
    expect(str.value).toBe('1');
  });

  it('zero is a valid region value', () => {
    const { getCell, config } = grid([
      [0, 0],
      [null, 0],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(region.value).toBe(0);
    expect(region.size).toBe(3);
  });
});

describe('Wave 25 contig-find-region — wrap floods', () => {
  it('wrap connects opposite edges of same value', () => {
    const values: CellValue[][] = [
      ['A', null, 'A'],
      [null, null, null],
      [null, null, null],
    ];
    const { getCell, config } = grid(values);
    const wrapConfig: ContiguousConfig = { ...config, wrap: true };
    const region = findRegion(0, 0, getCell, wrapConfig)!;
    expect(region.size).toBe(2);
    expect(
      region.positions.some((p) => p.row === 0 && p.col === 2)
    ).toBe(true);
  });

  it('without wrap, opposite-edge cells stay separate', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, null, null],
      [null, null, null],
    ]);
    expect(findRegion(0, 0, getCell, config)!.size).toBe(1);
    expect(findRegion(0, 2, getCell, config)!.size).toBe(1);
  });
});

describe('Wave 25 contig-find-region — custom neighbor fn', () => {
  it('accepts getHexNeighbors for hex flood', () => {
    const { getCell, config } = grid([
      ['B', 'B', null],
      ['B', null, null],
      [null, null, null],
    ]);
    const region = findRegion(
      0,
      0,
      getCell,
      config,
      getHexNeighbors
    )!;
    expect(region.value).toBe('B');
    expect(region.size).toBeGreaterThanOrEqual(2);
  });

  it('custom neighbor that returns empty freezes at start cell', () => {
    const { getCell, config } = grid([
      ['Z', 'Z'],
      ['Z', 'Z'],
    ]);
    const none = (): GridPosition[] => [];
    const region = findRegion(0, 0, getCell, config, none)!;
    expect(region.size).toBe(1);
  });

  it('default getNeighbors matches explicit pass-through', () => {
    const { getCell, config } = grid([
      ['M', 'M', null],
      ['M', null, null],
      [null, null, 'M'],
    ]);
    const a = findRegion(0, 0, getCell, config)!;
    const b = findRegion(0, 0, getCell, config, getNeighbors)!;
    expect(a.size).toBe(b.size);
    expect(a.value).toBe(b.value);
  });
});

describe('Wave 25 contig-find-region — position uniqueness', () => {
  it('positions list has no duplicate coordinates', () => {
    const { getCell, config } = grid([
      ['S', 'S', 'S'],
      ['S', 'S', 'S'],
      ['S', 'S', 'S'],
    ]);
    const region = findRegion(1, 1, getCell, config)!;
    expect(region.size).toBe(9);
    const keys = region.positions.map((p) => `${p.row},${p.col}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('size always equals positions.length', () => {
    const boards = [
      [['A']],
      [
        ['A', 'A'],
        ['A', null],
      ],
      [
        ['X', 'Y', 'X'],
        ['X', 'X', 'Y'],
        [null, 'Y', 'Y'],
      ],
    ] as CellValue[][][];
    for (const values of boards) {
      const { getCell, config } = grid(values);
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          const region = findRegion(r, c, getCell, config);
          if (region) {
            expect(region.size).toBe(region.positions.length);
          }
        }
      }
    }
  });
});
