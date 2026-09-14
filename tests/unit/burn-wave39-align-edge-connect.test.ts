/**
 * Wave 39 — contiguous regionTouchesEdge / regionConnectsEdges leftovers.
 * After wave 25; not re-burned in 36–38. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findRegion,
  findRegionsForValue,
  getLargestRegion,
  regionTouchesEdge,
  regionConnectsEdges,
  countRegionsByValue,
  areConnected,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  Region,
} from '../../src/core/alignment/types';

function grid(values: (CellValue | null)[][]): {
  getCell: CellGetter;
  config: ContiguousConfig;
} {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return values[r][c];
    },
  };
}

function regionOf(
  values: (CellValue | null)[][],
  row: number,
  col: number
): Region {
  const { getCell, config } = grid(values);
  const region = findRegion(row, col, getCell, config);
  if (!region) throw new Error('expected region');
  return region;
}

describe('Wave 39 align — edge touch matrix', () => {
  it('regionTouchesEdge true for each of the four edges', () => {
    const board: (CellValue | null)[][] = [
      ['A', null, null],
      [null, null, null],
      [null, null, 'A'],
    ];
    // Force a left-edge strip
    const leftBoard: (CellValue | null)[][] = [
      ['L', null, null],
      ['L', null, null],
      ['L', null, null],
    ];
    const top = regionOf(
      [
        ['T', 'T', 'T'],
        [null, null, null],
        [null, null, null],
      ],
      0,
      1
    );
    const bottom = regionOf(
      [
        [null, null, null],
        [null, null, null],
        ['B', 'B', 'B'],
      ],
      2,
      1
    );
    const left = regionOf(leftBoard, 1, 0);
    const right = regionOf(
      [
        [null, null, 'R'],
        [null, null, 'R'],
        [null, null, 'R'],
      ],
      1,
      2
    );
    const cfg: ContiguousConfig = { rows: 3, cols: 3 };
    expect(regionTouchesEdge(top, 'top', cfg)).toBe(true);
    expect(regionTouchesEdge(top, 'bottom', cfg)).toBe(false);
    expect(regionTouchesEdge(bottom, 'bottom', cfg)).toBe(true);
    expect(regionTouchesEdge(left, 'left', cfg)).toBe(true);
    expect(regionTouchesEdge(right, 'right', cfg)).toBe(true);
    void board;
  });

  it('regionConnectsEdges true only when both opposite edges touched', () => {
    const bridge = regionOf(
      [
        ['X', null, null],
        ['X', null, null],
        ['X', null, null],
      ],
      1,
      0
    );
    const stub = regionOf(
      [
        ['Y', null, null],
        [null, null, null],
        [null, null, null],
      ],
      0,
      0
    );
    const cfg: ContiguousConfig = { rows: 3, cols: 3 };
    expect(regionConnectsEdges(bridge, 'top', 'bottom', cfg)).toBe(true);
    expect(regionConnectsEdges(stub, 'top', 'bottom', cfg)).toBe(false);
    expect(regionConnectsEdges(stub, 'left', 'right', cfg)).toBe(false);
  });
});

describe('Wave 39 align — value regions / largest / counts', () => {
  it('findRegionsForValue + getLargestRegion + empty largest', () => {
    const values: (CellValue | null)[][] = [
      ['A', 'A', null],
      [null, 'B', 'B'],
      ['A', null, 'B'],
    ];
    const { getCell, config } = grid(values);
    const aRegions = findRegionsForValue('A', getCell, config);
    expect(aRegions.length).toBe(2);
    const largestA = getLargestRegion('A', getCell, config);
    expect(largestA?.size).toBe(2);
    expect(getLargestRegion('Z', getCell, config)).toBeNull();
  });

  it('countRegionsByValue and areConnected leftovers', () => {
    const values: (CellValue | null)[][] = [
      ['A', 'A', 'B'],
      [null, 'B', 'B'],
      ['A', null, null],
    ];
    const { getCell, config } = grid(values);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get('A')).toBe(2);
    expect(counts.get('B')).toBe(1);
    expect(areConnected({ row: 0, col: 0 }, { row: 0, col: 1 }, getCell, config)).toBe(
      true
    );
    expect(areConnected({ row: 0, col: 0 }, { row: 2, col: 0 }, getCell, config)).toBe(
      false
    );
  });
});
