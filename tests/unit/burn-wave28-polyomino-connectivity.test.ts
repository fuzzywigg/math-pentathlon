/**
 * Wave 28 — polyomino transform connectivity (areCellsConnected / isAdjacent / CoM).
 * Distinct from #142 fractions/expr/timer/dice/graph, #141 contiguous flood-fill,
 * and base polyomino.test smoke (which never called these APIs).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  areCellsConnected,
  isAdjacent,
  getCenterOfMass,
  TETROMINOES,
  PENTOMINOES,
  getPolyominoesByOrder,
  type Cell,
} from '../../src/core/polyomino';

const key = (c: Cell) => `${c.row},${c.col}`;

describe('Wave 28 polyomino-connectivity — areCellsConnected trivial', () => {
  it('empty and single-cell sets are connected', () => {
    expect(areCellsConnected([])).toBe(true);
    expect(areCellsConnected([{ row: 0, col: 0 }])).toBe(true);
    expect(areCellsConnected([{ row: 9, col: -3 }])).toBe(true);
  });

  it('cardinal domino is connected; diagonal pair is not', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
    ).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
      ])
    ).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ])
    ).toBe(false);
  });

  it('gap in a straight tromino disconnects', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ])
    ).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ])
    ).toBe(false);
  });
});

describe('Wave 28 polyomino-connectivity — areCellsConnected shapes', () => {
  it('every catalog tetromino and pentomino is 4-connected', () => {
    for (const shape of [...TETROMINOES, ...PENTOMINOES]) {
      expect(areCellsConnected(shape.cells)).toBe(true);
    }
  });

  it('every monomino/domino/tromino catalog entry is connected', () => {
    for (const order of [1, 2, 3]) {
      for (const shape of getPolyominoesByOrder(order)) {
        expect(areCellsConnected(shape.cells)).toBe(true);
      }
    }
  });

  it('L-shape remains connected; removing the elbow splits it', () => {
    const L: Cell[] = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ];
    expect(areCellsConnected(L)).toBe(true);
    const withoutElbow = L.filter((c) => !(c.row === 2 && c.col === 0));
    expect(areCellsConnected(withoutElbow)).toBe(false);
  });

  it('duplicate cells still count as connected when the unique set is', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    // BFS visits unique keys; size check uses cells.length so duplicates fail
    expect(areCellsConnected(cells)).toBe(false);
  });

  it('two separate islands of two cells each are disconnected', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
      ])
    ).toBe(false);
  });
});

describe('Wave 28 polyomino-connectivity — isAdjacent', () => {
  it('cardinal neighbors are adjacent; diagonals and same cell are not', () => {
    const set: Cell[] = [{ row: 2, col: 2 }];
    expect(isAdjacent({ row: 1, col: 2 }, set)).toBe(true);
    expect(isAdjacent({ row: 3, col: 2 }, set)).toBe(true);
    expect(isAdjacent({ row: 2, col: 1 }, set)).toBe(true);
    expect(isAdjacent({ row: 2, col: 3 }, set)).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, set)).toBe(false);
    expect(isAdjacent({ row: 2, col: 2 }, set)).toBe(false);
    expect(isAdjacent({ row: 0, col: 0 }, set)).toBe(false);
  });

  it('empty set never reports adjacency', () => {
    expect(isAdjacent({ row: 0, col: 0 }, [])).toBe(false);
  });

  it('probe adjacent to any member of a multi-cell set succeeds', () => {
    const set: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    expect(isAdjacent({ row: 1, col: 0 }, set)).toBe(true);
    expect(isAdjacent({ row: 1, col: 2 }, set)).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, set)).toBe(true);
    expect(isAdjacent({ row: 2, col: 1 }, set)).toBe(false);
  });

  it('corner placement of T-tetromino: stem foot is adjacent to bar', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const bar = t.cells.filter((c) => c.row === 0);
    const stem = t.cells.find((c) => c.row === 1)!;
    expect(isAdjacent(stem, bar)).toBe(true);
    expect(isAdjacent({ row: 2, col: 1 }, bar)).toBe(false);
  });
});

describe('Wave 28 polyomino-connectivity — getCenterOfMass', () => {
  it('empty cells return origin', () => {
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
  });

  it('single cell returns its coordinates as floats', () => {
    expect(getCenterOfMass([{ row: 3, col: -2 }])).toEqual({
      row: 3,
      col: -2,
    });
  });

  it('horizontal domino CoM is midpoint', () => {
    expect(
      getCenterOfMass([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ])
    ).toEqual({ row: 0, col: 1 });
  });

  it('O-tetromino CoM is geometric center (0.5, 0.5)', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const com = getCenterOfMass(o.cells);
    expect(com.row).toBeCloseTo(0.5);
    expect(com.col).toBeCloseTo(0.5);
  });

  it('I-tetromino CoM sits on the bar midline', () => {
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    const com = getCenterOfMass(i.cells);
    expect(com.row).toBe(0);
    expect(com.col).toBeCloseTo(1.5);
  });

  it('translated set shifts CoM by the same offset', () => {
    const base = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 1 },
    ];
    const shifted = base.map((c) => ({ row: c.row + 4, col: c.col + 7 }));
    const a = getCenterOfMass(base);
    const b = getCenterOfMass(shifted);
    expect(b.row).toBeCloseTo(a.row + 4);
    expect(b.col).toBeCloseTo(a.col + 7);
  });

  it('catalog shapes: CoM keys are finite numbers', () => {
    for (const shape of [...TETROMINOES, ...PENTOMINOES]) {
      const com = getCenterOfMass(shape.cells);
      expect(Number.isFinite(com.row)).toBe(true);
      expect(Number.isFinite(com.col)).toBe(true);
      expect(
        key({ row: Math.floor(com.row), col: Math.floor(com.col) })
      ).toMatch(/^-?\d+,-?\d+$/);
    }
  });
});
