/**
 * Wave 25 — contiguous findPath + edge-touch / edge-connect matrices.
 * Distinct from #133 grid-alignment checkForWinner / checkMoveForWin.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getHexNeighbors,
  findRegion,
  findPath,
  regionTouchesEdge,
  regionConnectsEdges,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  GridPosition,
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
  positions: GridPosition[],
  value: CellValue = 'X'
): Region {
  return { value, positions, size: positions.length };
}

describe('Wave 25 contiguous-path — findPath basics', () => {
  it('returns null when start empty or values differ', () => {
    const { getCell, config } = grid([
      [null, 'A'],
      ['A', 'B'],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 1, col: 0 }, getCell, config)
    ).toBeNull();
    expect(
      findPath({ row: 1, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBeNull();
  });

  it('same-cell path is a singleton when occupied', () => {
    const { getCell, config } = grid([['Z']]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 0 }, getCell, config)
    ).toEqual([{ row: 0, col: 0 }]);
  });

  it('finds shortest BFS path along a corridor', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'R'],
      [null, null, 'R'],
      [null, null, 'R'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      config
    )!;
    expect(path[0]).toEqual({ row: 0, col: 0 });
    expect(path[path.length - 1]).toEqual({ row: 2, col: 2 });
    expect(path.length).toBe(5);
    // every step is adjacent under 4-way
    for (let i = 1; i < path.length; i++) {
      const dr = Math.abs(path[i].row - path[i - 1].row);
      const dc = Math.abs(path[i].col - path[i - 1].col);
      expect(dr + dc).toBe(1);
    }
  });

  it('returns null when blocked by null barrier', () => {
    const { getCell, config } = grid([
      ['R', null, 'R'],
      ['R', null, 'R'],
      [null, null, null],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 2 }, getCell, config)
    ).toBeNull();
  });

  it('8-way path can step diagonally across barrier', () => {
    const { getCell, config } = grid([
      ['R', null, 'R'],
      [null, 'R', null],
      [null, null, null],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 2 }, getCell, config)
    ).toBeNull();
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      { ...config, includeDiagonals: true }
    )!;
    expect(path).not.toBeNull();
    expect(path[0]).toEqual({ row: 0, col: 0 });
    expect(path[path.length - 1]).toEqual({ row: 0, col: 2 });
  });

  it('wrap enables path across horizontal torus edge', () => {
    const { getCell, config } = grid([
      ['T', null, 'T'],
      [null, null, null],
      [null, null, null],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 2 }, getCell, config)
    ).toBeNull();
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      { ...config, wrap: true }
    )!;
    expect(path).not.toBeNull();
    expect(path.length).toBe(2);
  });

  it('hex neighbor fn finds path along hex adjacency', () => {
    const { getCell, config } = grid([
      ['H', 'H', 'H'],
      [null, null, 'H'],
      [null, null, 'H'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      config,
      getHexNeighbors
    );
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 2, col: 2 });
  });

  it('numeric values work the same as strings', () => {
    const { getCell, config } = grid([
      [9, 9],
      [null, 9],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      getCell,
      config
    )!;
    expect(path.map((p) => `${p.row},${p.col}`)).toEqual([
      '0,0',
      '0,1',
      '1,1',
    ]);
  });

  it('does not traverse through foreign values', () => {
    const { getCell, config } = grid([
      ['A', 'B', 'A'],
      ['A', 'A', 'A'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      config
    )!;
    expect(path.every((p) => getCell(p.row, p.col) === 'A')).toBe(true);
    expect(path.some((p) => p.row === 0 && p.col === 1)).toBe(false);
  });

  it('custom neighbor that returns empty yields null for distant cells', () => {
    const { getCell, config } = grid([
      ['A', 'A'],
      ['A', 'A'],
    ]);
    const noNeighbors = () => [] as GridPosition[];
    expect(
      findPath(
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        getCell,
        config,
        noNeighbors
      )
    ).toBeNull();
    // same cell still works before neighbor expansion matters
    expect(
      findPath(
        { row: 0, col: 0 },
        { row: 0, col: 0 },
        getCell,
        config,
        noNeighbors
      )
    ).toEqual([{ row: 0, col: 0 }]);
  });
});

describe('Wave 25 contiguous-path — regionTouchesEdge', () => {
  const config: ContiguousConfig = { rows: 4, cols: 5 };

  it('detects each of the four edges independently', () => {
    expect(
      regionTouchesEdge(regionOf([{ row: 0, col: 2 }]), 'top', config)
    ).toBe(true);
    expect(
      regionTouchesEdge(regionOf([{ row: 0, col: 2 }]), 'bottom', config)
    ).toBe(false);

    expect(
      regionTouchesEdge(regionOf([{ row: 3, col: 1 }]), 'bottom', config)
    ).toBe(true);
    expect(
      regionTouchesEdge(regionOf([{ row: 3, col: 1 }]), 'top', config)
    ).toBe(false);

    expect(
      regionTouchesEdge(regionOf([{ row: 2, col: 0 }]), 'left', config)
    ).toBe(true);
    expect(
      regionTouchesEdge(regionOf([{ row: 2, col: 0 }]), 'right', config)
    ).toBe(false);

    expect(
      regionTouchesEdge(regionOf([{ row: 1, col: 4 }]), 'right', config)
    ).toBe(true);
    expect(
      regionTouchesEdge(regionOf([{ row: 1, col: 4 }]), 'left', config)
    ).toBe(false);
  });

  it('interior-only region touches no edges', () => {
    const region = regionOf([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ]);
    for (const edge of ['top', 'bottom', 'left', 'right'] as const) {
      expect(regionTouchesEdge(region, edge, config)).toBe(false);
    }
  });

  it('corner cell touches two edges', () => {
    const region = regionOf([{ row: 0, col: 0 }]);
    expect(regionTouchesEdge(region, 'top', config)).toBe(true);
    expect(regionTouchesEdge(region, 'left', config)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', config)).toBe(false);
    expect(regionTouchesEdge(region, 'right', config)).toBe(false);
  });

  it('uses config rows/cols for bottom/right thresholds', () => {
    const tall: ContiguousConfig = { rows: 10, cols: 2 };
    expect(
      regionTouchesEdge(regionOf([{ row: 9, col: 0 }]), 'bottom', tall)
    ).toBe(true);
    expect(
      regionTouchesEdge(regionOf([{ row: 8, col: 0 }]), 'bottom', tall)
    ).toBe(false);
    expect(
      regionTouchesEdge(regionOf([{ row: 0, col: 1 }]), 'right', tall)
    ).toBe(true);
  });

  it('empty region never touches an edge', () => {
    const empty = regionOf([]);
    expect(regionTouchesEdge(empty, 'top', config)).toBe(false);
    expect(regionTouchesEdge(empty, 'left', config)).toBe(false);
  });
});

describe('Wave 25 contiguous-path — regionConnectsEdges', () => {
  it('vertical bridge connects top-bottom', () => {
    const { getCell, config } = grid([
      ['X', null, null],
      ['X', null, null],
      ['X', null, null],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(false);
  });

  it('horizontal bridge connects left-right', () => {
    const { getCell, config } = grid([
      [null, null, null],
      ['Y', 'Y', 'Y'],
      [null, null, null],
    ]);
    const region = findRegion(1, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(true);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(false);
  });

  it('full board connects all opposite pairs', () => {
    const { getCell, config } = grid([
      ['F', 'F'],
      ['F', 'F'],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(true);
  });

  it('L-shape may touch two adjacent edges without opposite connect', () => {
    const { getCell, config } = grid([
      ['L', null, null],
      ['L', null, null],
      ['L', 'L', 'L'],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionTouchesEdge(region, 'top', config)).toBe(true);
    expect(regionTouchesEdge(region, 'left', config)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', config)).toBe(true);
    expect(regionTouchesEdge(region, 'right', config)).toBe(true);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(true);
  });

  it('incomplete span fails opposite-edge connect', () => {
    const { getCell, config } = grid([
      ['Z', 'Z', null],
      [null, null, null],
      [null, null, null],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(false);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(false);
  });

  it('order of edge args does not matter', () => {
    const region = regionOf([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ]);
    const config: ContiguousConfig = { rows: 3, cols: 3 };
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(regionConnectsEdges(region, 'bottom', 'top', config)).toBe(true);
  });

  it('hex-style left-right win via findRegion + getHexNeighbors', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'R'],
      [null, null, null],
      [null, null, null],
    ]);
    const region = findRegion(0, 0, getCell, config, getHexNeighbors)!;
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(true);
  });

  it('works with default getNeighbors through findRegion integration', () => {
    const { getCell, config } = grid([
      ['B', null],
      ['B', null],
      ['B', null],
      ['B', null],
    ]);
    const region = findRegion(0, 0, getCell, config, getNeighbors)!;
    expect(region.size).toBe(4);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
  });
});
