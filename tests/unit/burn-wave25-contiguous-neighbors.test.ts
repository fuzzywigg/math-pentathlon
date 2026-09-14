/**
 * Wave 25 — contiguous neighbor APIs (direct module, not compat wrappers).
 * Distinct from #133 grid-alignment line scans and wave 21 hex-region smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getHexNeighbors,
} from '../../src/core/alignment/contiguous';
import {
  HEX_NEIGHBORS_EVEN_ROW,
  HEX_NEIGHBORS_ODD_ROW,
  type ContiguousConfig,
  type GridPosition,
} from '../../src/core/alignment/types';

const key = (p: GridPosition) => `${p.row},${p.col}`;
const sortedKeys = (ps: GridPosition[]) => ps.map(key).sort();

describe('Wave 25 contiguous-neighbors — getNeighbors 4-way', () => {
  it('center cell returns four cardinals without diagonals', () => {
    const config: ContiguousConfig = { rows: 5, cols: 5 };
    const n = getNeighbors(2, 2, config);
    expect(sortedKeys(n)).toEqual(['1,2', '2,1', '2,3', '3,2']);
    expect(n).toHaveLength(4);
  });

  it('corner cells drop OOB neighbors', () => {
    const config: ContiguousConfig = { rows: 3, cols: 3 };
    expect(sortedKeys(getNeighbors(0, 0, config))).toEqual(['0,1', '1,0']);
    expect(sortedKeys(getNeighbors(0, 2, config))).toEqual(['0,1', '1,2']);
    expect(sortedKeys(getNeighbors(2, 0, config))).toEqual(['1,0', '2,1']);
    expect(sortedKeys(getNeighbors(2, 2, config))).toEqual(['1,2', '2,1']);
  });

  it('edge (non-corner) cells keep three neighbors', () => {
    const config: ContiguousConfig = { rows: 4, cols: 4 };
    expect(sortedKeys(getNeighbors(0, 1, config))).toEqual([
      '0,0',
      '0,2',
      '1,1',
    ]);
    expect(sortedKeys(getNeighbors(2, 0, config))).toEqual([
      '1,0',
      '2,1',
      '3,0',
    ]);
    expect(sortedKeys(getNeighbors(3, 2, config))).toEqual([
      '2,2',
      '3,1',
      '3,3',
    ]);
    expect(sortedKeys(getNeighbors(1, 3, config))).toEqual([
      '0,3',
      '1,2',
      '2,3',
    ]);
  });

  it('1x1 board has no in-bounds neighbors without wrap', () => {
    expect(getNeighbors(0, 0, { rows: 1, cols: 1 })).toEqual([]);
  });

  it('includeDiagonals false is explicit default behavior', () => {
    const a = getNeighbors(1, 1, { rows: 3, cols: 3 });
    const b = getNeighbors(1, 1, {
      rows: 3,
      cols: 3,
      includeDiagonals: false,
    });
    expect(sortedKeys(a)).toEqual(sortedKeys(b));
    expect(a).toHaveLength(4);
  });
});

describe('Wave 25 contiguous-neighbors — getNeighbors 8-way', () => {
  it('center cell returns all eight offsets', () => {
    const n = getNeighbors(2, 2, {
      rows: 5,
      cols: 5,
      includeDiagonals: true,
    });
    expect(n).toHaveLength(8);
    expect(sortedKeys(n)).toEqual([
      '1,1',
      '1,2',
      '1,3',
      '2,1',
      '2,3',
      '3,1',
      '3,2',
      '3,3',
    ]);
  });

  it('corner with diagonals yields three neighbors', () => {
    const n = getNeighbors(0, 0, {
      rows: 3,
      cols: 3,
      includeDiagonals: true,
    });
    expect(sortedKeys(n)).toEqual(['0,1', '1,0', '1,1']);
  });

  it('edge mid with diagonals yields five neighbors', () => {
    const n = getNeighbors(0, 1, {
      rows: 3,
      cols: 3,
      includeDiagonals: true,
    });
    expect(sortedKeys(n)).toEqual(['0,0', '0,2', '1,0', '1,1', '1,2']);
  });

  it('2x2 fully connected under 8-way from any cell', () => {
    const config: ContiguousConfig = {
      rows: 2,
      cols: 2,
      includeDiagonals: true,
    };
    for (const [r, c] of [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ] as const) {
      expect(getNeighbors(r, c, config)).toHaveLength(3);
    }
  });
});

describe('Wave 25 contiguous-neighbors — wrap torus', () => {
  it('4-way wrap at corner reconnects opposite edges', () => {
    const n = getNeighbors(0, 0, { rows: 4, cols: 5, wrap: true });
    expect(n).toHaveLength(4);
    expect(sortedKeys(n)).toEqual(['0,1', '0,4', '1,0', '3,0']);
  });

  it('4-way wrap at bottom-right', () => {
    const n = getNeighbors(3, 4, { rows: 4, cols: 5, wrap: true });
    expect(sortedKeys(n)).toEqual(['0,4', '2,4', '3,0', '3,3']);
  });

  it('8-way wrap yields eight unique neighbors on large board', () => {
    const n = getNeighbors(0, 0, {
      rows: 5,
      cols: 5,
      includeDiagonals: true,
      wrap: true,
    });
    expect(n).toHaveLength(8);
    expect(new Set(sortedKeys(n)).size).toBe(8);
    expect(sortedKeys(n)).toEqual([
      '0,1',
      '0,4',
      '1,0',
      '1,1',
      '1,4',
      '4,0',
      '4,1',
      '4,4',
    ]);
  });

  it('1x1 wrap 4-way collapses all offsets onto self once each filter', () => {
    const n = getNeighbors(0, 0, { rows: 1, cols: 1, wrap: true });
    // every cardinal wraps to (0,0); isInBounds keeps duplicates
    expect(n.every((p) => p.row === 0 && p.col === 0)).toBe(true);
    expect(n).toHaveLength(4);
  });

  it('2x2 wrap 4-way never leaves the board', () => {
    const n = getNeighbors(0, 0, { rows: 2, cols: 2, wrap: true });
    expect(n).toHaveLength(4);
    expect(n.every((p) => p.row >= 0 && p.row < 2 && p.col >= 0 && p.col < 2)).toBe(
      true
    );
  });
});

describe('Wave 25 contiguous-neighbors — getHexNeighbors parity', () => {
  it('even-row offsets match HEX_NEIGHBORS_EVEN_ROW when in-bounds', () => {
    const config: ContiguousConfig = { rows: 6, cols: 6 };
    const n = getHexNeighbors(2, 2, config);
    const expected = HEX_NEIGHBORS_EVEN_ROW.map((o) => ({
      row: 2 + o.row,
      col: 2 + o.col,
    })).filter((p) => p.row >= 0 && p.row < 6 && p.col >= 0 && p.col < 6);
    expect(sortedKeys(n)).toEqual(sortedKeys(expected));
    expect(n).toHaveLength(6);
  });

  it('odd-row offsets match HEX_NEIGHBORS_ODD_ROW when in-bounds', () => {
    const config: ContiguousConfig = { rows: 6, cols: 6 };
    const n = getHexNeighbors(3, 2, config);
    const expected = HEX_NEIGHBORS_ODD_ROW.map((o) => ({
      row: 3 + o.row,
      col: 2 + o.col,
    })).filter((p) => p.row >= 0 && p.row < 6 && p.col >= 0 && p.col < 6);
    expect(sortedKeys(n)).toEqual(sortedKeys(expected));
    expect(n).toHaveLength(6);
  });

  it('even and odd center neighborhoods differ', () => {
    const config: ContiguousConfig = { rows: 7, cols: 7 };
    const even = sortedKeys(getHexNeighbors(2, 3, config));
    const odd = sortedKeys(getHexNeighbors(3, 3, config));
    expect(even).not.toEqual(odd);
  });

  it('hex corner without wrap has fewer than 6 neighbors', () => {
    const config: ContiguousConfig = { rows: 4, cols: 4 };
    expect(getHexNeighbors(0, 0, config).length).toBeLessThan(6);
    expect(getHexNeighbors(0, 3, config).length).toBeLessThan(6);
    expect(getHexNeighbors(3, 0, config).length).toBeLessThan(6);
    expect(getHexNeighbors(3, 3, config).length).toBeLessThan(6);
  });

  it('hex wrap restores six neighbors at corner', () => {
    const wrapped = getHexNeighbors(0, 0, { rows: 4, cols: 4, wrap: true });
    expect(wrapped).toHaveLength(6);
    expect(new Set(sortedKeys(wrapped)).size).toBe(6);
    expect(
      wrapped.every((p) => p.row >= 0 && p.row < 4 && p.col >= 0 && p.col < 4)
    ).toBe(true);
  });

  it('hex wrap on odd edge row uses odd offsets after wrapPosition', () => {
    const n = getHexNeighbors(1, 0, { rows: 3, cols: 3, wrap: true });
    expect(n).toHaveLength(6);
    // left neighbor wraps horizontally
    expect(n.some((p) => p.row === 1 && p.col === 2)).toBe(true);
  });

  it('includeDiagonals is ignored by getHexNeighbors', () => {
    const a = getHexNeighbors(2, 2, {
      rows: 5,
      cols: 5,
      includeDiagonals: true,
    });
    const b = getHexNeighbors(2, 2, {
      rows: 5,
      cols: 5,
      includeDiagonals: false,
    });
    expect(sortedKeys(a)).toEqual(sortedKeys(b));
  });
});
