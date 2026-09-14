/**
 * Wave 25 — contiguous getNeighbors / getHexNeighbors (raw contiguous.ts).
 * Distinct from wave 21 hex-region smoke and wave 24 N-in-a-row alignment.
 * Compat-shadowed neighbor APIs exercised directly. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getHexNeighbors,
} from '../../src/core/alignment/contiguous';
import type { ContiguousConfig } from '../../src/core/alignment/types';

function key(p: { row: number; col: number }): string {
  return `${p.row},${p.col}`;
}

describe('Wave 25 contig-neighbors — getNeighbors 4-way', () => {
  const config: ContiguousConfig = { rows: 5, cols: 5 };

  it('center cell has exactly four cardinal neighbors', () => {
    const n = getNeighbors(2, 2, config);
    expect(n).toHaveLength(4);
    expect(n.map(key).sort()).toEqual(
      ['1,2', '2,1', '2,3', '3,2'].sort()
    );
  });

  it('corner cell has two neighbors; edge cell has three', () => {
    expect(getNeighbors(0, 0, config).map(key).sort()).toEqual(
      ['0,1', '1,0'].sort()
    );
    expect(getNeighbors(0, 2, config)).toHaveLength(3);
    expect(getNeighbors(4, 4, config)).toHaveLength(2);
    expect(getNeighbors(2, 0, config)).toHaveLength(3);
  });

  it('does not include diagonals when includeDiagonals is false/omitted', () => {
    const n = getNeighbors(2, 2, config);
    expect(n.some((p) => p.row === 1 && p.col === 1)).toBe(false);
    expect(n.some((p) => p.row === 3 && p.col === 3)).toBe(false);
  });

  it('1x1 board yields empty neighbor list', () => {
    expect(getNeighbors(0, 0, { rows: 1, cols: 1 })).toEqual([]);
  });

  it('2x2 corners each have two neighbors', () => {
    const c: ContiguousConfig = { rows: 2, cols: 2 };
    for (const [r, col] of [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ] as const) {
      expect(getNeighbors(r, col, c)).toHaveLength(2);
    }
  });
});

describe('Wave 25 contig-neighbors — getNeighbors 8-way diagonals', () => {
  const config: ContiguousConfig = {
    rows: 5,
    cols: 5,
    includeDiagonals: true,
  };

  it('center cell has eight neighbors including diagonals', () => {
    const n = getNeighbors(2, 2, config);
    expect(n).toHaveLength(8);
    expect(n.map(key).sort()).toEqual(
      [
        '1,1',
        '1,2',
        '1,3',
        '2,1',
        '2,3',
        '3,1',
        '3,2',
        '3,3',
      ].sort()
    );
  });

  it('corner has three neighbors under 8-connectivity', () => {
    expect(getNeighbors(0, 0, config).map(key).sort()).toEqual(
      ['0,1', '1,0', '1,1'].sort()
    );
  });

  it('edge mid-cell has five neighbors under 8-connectivity', () => {
    expect(getNeighbors(0, 2, config)).toHaveLength(5);
  });
});

describe('Wave 25 contig-neighbors — wrap / toroidal', () => {
  it('4-way wrap at corner yields four neighbors via torus', () => {
    const config: ContiguousConfig = { rows: 3, cols: 3, wrap: true };
    const n = getNeighbors(0, 0, config);
    expect(n).toHaveLength(4);
    expect(n.map(key).sort()).toEqual(
      ['0,1', '0,2', '1,0', '2,0'].sort()
    );
  });

  it('8-way wrap at corner yields eight neighbors', () => {
    const config: ContiguousConfig = {
      rows: 3,
      cols: 3,
      wrap: true,
      includeDiagonals: true,
    };
    const n = getNeighbors(0, 0, config);
    expect(n).toHaveLength(8);
    // Every other cell on a 3x3 torus is a neighbor of (0,0)
    expect(new Set(n.map(key)).size).toBe(8);
    expect(n.every((p) => !(p.row === 0 && p.col === 0))).toBe(true);
  });

  it('wrap mid-edge still stays within [0,rows) x [0,cols)', () => {
    const config: ContiguousConfig = { rows: 4, cols: 4, wrap: true };
    for (const [r, c] of [
      [0, 2],
      [3, 2],
      [2, 0],
      [2, 3],
    ] as const) {
      const n = getNeighbors(r, c, config);
      expect(n).toHaveLength(4);
      for (const p of n) {
        expect(p.row).toBeGreaterThanOrEqual(0);
        expect(p.row).toBeLessThan(4);
        expect(p.col).toBeGreaterThanOrEqual(0);
        expect(p.col).toBeLessThan(4);
      }
    }
  });
});

describe('Wave 25 contig-neighbors — getHexNeighbors parity + wrap', () => {
  const config: ContiguousConfig = { rows: 6, cols: 6 };

  it('even and odd rows use different offset sets', () => {
    const even = getHexNeighbors(2, 2, config);
    const odd = getHexNeighbors(3, 2, config);
    expect(even.map(key).sort()).not.toEqual(odd.map(key).sort());
    expect(even.length).toBeLessThanOrEqual(6);
    expect(odd.length).toBeLessThanOrEqual(6);
  });

  it('interior even-row cell reaches six neighbors', () => {
    const n = getHexNeighbors(2, 2, config);
    expect(n).toHaveLength(6);
  });

  it('interior odd-row cell reaches six neighbors', () => {
    const n = getHexNeighbors(3, 2, config);
    expect(n).toHaveLength(6);
  });

  it('corner hex has fewer than six in-bounds neighbors without wrap', () => {
    const corner = getHexNeighbors(0, 0, config);
    expect(corner.length).toBeLessThan(6);
    expect(corner.every((p) => p.row >= 0 && p.col >= 0)).toBe(true);
  });

  it('wrap restores six neighbors at corner', () => {
    const wrapped = getHexNeighbors(0, 0, {
      rows: 4,
      cols: 4,
      wrap: true,
    });
    expect(wrapped).toHaveLength(6);
    for (const p of wrapped) {
      expect(p.row).toBeGreaterThanOrEqual(0);
      expect(p.row).toBeLessThan(4);
      expect(p.col).toBeGreaterThanOrEqual(0);
      expect(p.col).toBeLessThan(4);
    }
  });

  it('hex neighbors never include self', () => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const n = getHexNeighbors(r, c, { rows: 4, cols: 4 });
        expect(n.some((p) => p.row === r && p.col === c)).toBe(false);
      }
    }
  });

  it('hex neighbor relation is approximately symmetric on interior', () => {
    const a = { row: 2, col: 2 };
    const neighbors = getHexNeighbors(a.row, a.col, config);
    for (const b of neighbors) {
      const back = getHexNeighbors(b.row, b.col, config);
      expect(
        back.some((p) => p.row === a.row && p.col === a.col)
      ).toBe(true);
    }
  });
});
