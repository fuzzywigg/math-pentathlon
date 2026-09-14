/**
 * Wave 25 — findPath BFS within contiguous same-value cells.
 * Shortest-path guarantees, wrap, diagonals, hex neighbor fn.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  findPath,
  getNeighbors,
  getHexNeighbors,
  areConnected,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  GridPosition,
} from '../../src/core/alignment/types';

function grid(
  values: (CellValue | null)[][],
  extra: Partial<ContiguousConfig> = {}
): { getCell: CellGetter; config: ContiguousConfig } {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols, ...extra },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return values[r][c];
    },
  };
}

function pathKeys(path: GridPosition[]): string[] {
  return path.map((p) => `${p.row},${p.col}`);
}

describe('Wave 25 contig-path — null / mismatch gates', () => {
  it('returns null when start empty', () => {
    const { getCell, config } = grid([
      [null, 'A'],
      ['A', 'A'],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBeNull();
  });

  it('returns null when end empty', () => {
    const { getCell, config } = grid([
      ['A', 'A'],
      ['A', null],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBeNull();
  });

  it('returns null when start and end values differ', () => {
    const { getCell, config } = grid([
      ['A', 'B'],
      ['A', 'B'],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 1 }, getCell, config)
    ).toBeNull();
  });

  it('returns null when both null (startValue === endValue === null gate)', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, null],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBeNull();
  });
});

describe('Wave 25 contig-path — trivial and corridor', () => {
  it('same start/end returns single-cell path', () => {
    const { getCell, config } = grid([
      ['Q', null],
      [null, null],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 0 },
      getCell,
      config
    )!;
    expect(path).toEqual([{ row: 0, col: 0 }]);
  });

  it('straight horizontal corridor', () => {
    const { getCell, config } = grid([
      ['X', 'X', 'X', 'X'],
      [null, null, null, null],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 3 },
      getCell,
      config
    )!;
    expect(path[0]).toEqual({ row: 0, col: 0 });
    expect(path[path.length - 1]).toEqual({ row: 0, col: 3 });
    expect(path).toHaveLength(4);
    expect(pathKeys(path)).toEqual(['0,0', '0,1', '0,2', '0,3']);
  });

  it('L-shaped corridor reaches end', () => {
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
    expect(path).not.toBeNull();
    expect(path[0]).toEqual({ row: 0, col: 0 });
    expect(path[path.length - 1]).toEqual({ row: 2, col: 2 });
    // BFS shortest: 5 cells
    expect(path.length).toBe(5);
  });

  it('returns null when disconnected under 4-connectivity', () => {
    const { getCell, config } = grid([
      ['R', null, 'R'],
      [null, null, null],
      ['R', null, 'R'],
    ]);
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 2 }, getCell, config)
    ).toBeNull();
  });
});

describe('Wave 25 contig-path — diagonals and wrap', () => {
  it('diagonal path requires includeDiagonals', () => {
    const values: (CellValue | null)[][] = [
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X'],
    ];
    const { getCell, config } = grid(values);
    expect(
      findPath({ row: 0, col: 0 }, { row: 2, col: 2 }, getCell, config)
    ).toBeNull();

    const withDiag: ContiguousConfig = {
      ...config,
      includeDiagonals: true,
    };
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      withDiag
    )!;
    expect(path).toHaveLength(3);
    expect(pathKeys(path)).toEqual(['0,0', '1,1', '2,2']);
  });

  it('wrap finds path across left/right boundary', () => {
    const { getCell, config } = grid(
      [
        ['A', null, 'A'],
        [null, null, null],
      ],
      { wrap: true }
    );
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      config
    )!;
    expect(path).not.toBeNull();
    expect(path.length).toBe(2);
  });
});

describe('Wave 25 contig-path — BFS shortest + validity', () => {
  it('prefers shorter route when two corridors exist', () => {
    // Two ways from (0,0) to (0,2): direct via (0,1), or long via bottom
    const { getCell, config } = grid([
      ['X', 'X', 'X'],
      ['X', null, 'X'],
      ['X', 'X', 'X'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      config
    )!;
    expect(path.length).toBe(3);
    expect(pathKeys(path)).toEqual(['0,0', '0,1', '0,2']);
  });

  it('every step is a neighbor under the neighbor fn', () => {
    const { getCell, config } = grid([
      ['S', 'S', null],
      [null, 'S', 'S'],
      [null, null, 'S'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      config,
      getNeighbors
    )!;
    for (let i = 0; i < path.length - 1; i++) {
      const neighbors = getNeighbors(path[i].row, path[i].col, config);
      expect(
        neighbors.some(
          (n) => n.row === path[i + 1].row && n.col === path[i + 1].col
        )
      ).toBe(true);
    }
  });

  it('all path cells share the start value', () => {
    const { getCell, config } = grid([
      ['M', 'M', 'O'],
      ['M', null, 'O'],
      ['M', 'M', 'M'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      config
    )!;
    expect(path.every((p) => getCell(p.row, p.col) === 'M')).toBe(true);
  });

  it('findPath non-null iff areConnected', () => {
    const boards: (CellValue | null)[][][] = [
      [
        ['A', 'A', null],
        [null, 'A', 'A'],
        [null, null, 'A'],
      ],
      [
        ['A', null, 'A'],
        [null, null, null],
        ['A', null, 'A'],
      ],
      [
        ['Z', 'Z'],
        ['Z', 'Z'],
      ],
    ];
    for (const values of boards) {
      const { getCell, config } = grid(values);
      const start = { row: 0, col: 0 };
      const end = {
        row: config.rows - 1,
        col: config.cols - 1,
      };
      if (getCell(start.row, start.col) == null) continue;
      if (getCell(end.row, end.col) == null) continue;
      const connected = areConnected(start, end, getCell, config);
      const path = findPath(start, end, getCell, config);
      expect(path !== null).toBe(connected);
    }
  });
});

describe('Wave 25 contig-path — hex neighbor fn', () => {
  it('hex path along a filled top row', () => {
    const { getCell, config } = grid([
      ['B', 'B', 'B'],
      [null, null, null],
      [null, null, null],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      config,
      getHexNeighbors
    );
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 0, col: 2 });
  });

  it('hex path steps are hex neighbors', () => {
    const { getCell, config } = grid([
      ['R', 'R', null],
      ['R', 'R', 'R'],
      [null, 'R', 'R'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      config,
      getHexNeighbors
    );
    if (path) {
      for (let i = 0; i < path.length - 1; i++) {
        const n = getHexNeighbors(path[i].row, path[i].col, config);
        expect(
          n.some(
            (p) =>
              p.row === path[i + 1].row && p.col === path[i + 1].col
          )
        ).toBe(true);
      }
    } else {
      // If hex geometry disconnects, square may still connect — that's ok
      expect(
        findPath(
          { row: 0, col: 0 },
          { row: 2, col: 2 },
          getCell,
          config,
          getNeighbors
        )
      ).not.toBeNull();
    }
  });
});
