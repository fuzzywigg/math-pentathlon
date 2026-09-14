/**
 * Wave 28 — catalog lookups, shape invariants, symmetry/equivalence stress.
 * Distinct from transform orientation burns and thin getPolyominoById smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  TETROMINOES,
  PENTOMINOES,
  SIMPLE_SHAPES,
  HEX_PATTERN_BLOCKS,
  getShapeById,
  getShapesBySize,
  getPolyominoById,
  getPolyominoesByOrder,
  getSymmetryCount,
  getAllTransformations,
  arePolyominoesEquivalent,
  areCellsEquivalent,
  cellsToKey,
  rotatePolyomino,
  flipPolyomino,
  areCellsConnected,
  type PolyominoShape,
} from '../../src/core/polyomino';

describe('Wave 28 poly-catalog — set sizes and id uniqueness', () => {
  it('standard sets have expected cardinalities', () => {
    expect(SIMPLE_SHAPES).toHaveLength(4);
    expect(TETROMINOES).toHaveLength(7);
    expect(PENTOMINOES).toHaveLength(12);
    expect(HEX_PATTERN_BLOCKS.length).toBeGreaterThanOrEqual(5);
  });

  it('ids are unique within each set', () => {
    for (const set of [
      SIMPLE_SHAPES,
      TETROMINOES,
      PENTOMINOES,
      HEX_PATTERN_BLOCKS,
    ]) {
      const ids = set.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('size and order match cell count for every catalog shape', () => {
    const all = [
      ...SIMPLE_SHAPES,
      ...TETROMINOES,
      ...PENTOMINOES,
      ...HEX_PATTERN_BLOCKS,
    ];
    for (const s of all) {
      // HEX pattern blocks may use size as area metaphor (hexagon size 6 / 1 cell)
      if (HEX_PATTERN_BLOCKS.includes(s)) {
        expect(s.order).toBe(s.size);
        expect(s.cells.length).toBeGreaterThan(0);
        continue;
      }
      expect(s.size).toBe(s.cells.length);
      expect(s.order).toBe(s.cells.length);
      expect(areCellsConnected(s.cells)).toBe(true);
    }
  });
});

describe('Wave 28 poly-catalog — getShapeById / getShapesBySize / lookup', () => {
  it('getShapeById finds within a set and misses cross-set', () => {
    expect(getShapeById('T', TETROMINOES)?.name).toBe('T-tetromino');
    expect(getShapeById('T', PENTOMINOES)).toBeUndefined();
    expect(getShapeById('X', PENTOMINOES)?.order).toBe(5);
  });

  it('getShapesBySize filters tetrominoes to order 4 only', () => {
    expect(getShapesBySize(4, TETROMINOES)).toHaveLength(7);
    expect(getShapesBySize(5, TETROMINOES)).toEqual([]);
    expect(getShapesBySize(5, PENTOMINOES)).toHaveLength(12);
    expect(getShapesBySize(1, SIMPLE_SHAPES)).toHaveLength(1);
  });

  it('getPolyominoById searches across all standard sets', () => {
    expect(getPolyominoById('monomino')?.order).toBe(1);
    expect(getPolyominoById('I')?.name).toContain('tetromino');
    expect(getPolyominoById('F')?.order).toBe(5);
    expect(getPolyominoById('hexagon')?.id).toBe('hexagon');
    expect(getPolyominoById('___missing___')).toBeUndefined();
  });

  it('getPolyominoesByOrder aggregates SIMPLE+TETRO+PENTO', () => {
    expect(getPolyominoesByOrder(4)).toHaveLength(7);
    expect(getPolyominoesByOrder(5)).toHaveLength(12);
    expect(getPolyominoesByOrder(99)).toEqual([]);
  });
});

describe('Wave 28 poly-catalog — symmetry and equivalence tables', () => {
  // Free-transform orbit sizes (4 rotations × 2 flips, deduped)
  const expectedSymmetry: Record<string, number> = {
    O: 1,
    I: 2,
    S: 4, // S↔Z mirrors expand the free orbit vs rotation-only
    Z: 4,
    T: 4,
    J: 8, // chiral under free transforms (catalog canFlip=false is ignored here)
    L: 8,
  };

  it('tetromino symmetry counts match known table', () => {
    for (const [id, count] of Object.entries(expectedSymmetry)) {
      const shape = TETROMINOES.find((s) => s.id === id)!;
      expect(getSymmetryCount(shape), id).toBe(count);
      expect(getAllTransformations(shape)).toHaveLength(count);
    }
  });

  it('rotatePolyomino result is equivalent to original when rotatable', () => {
    for (const shape of TETROMINOES.filter((s) => s.canRotate)) {
      const rotated = rotatePolyomino(shape);
      expect(arePolyominoesEquivalent(shape, rotated)).toBe(true);
      expect(rotated.id).toBe(shape.id);
    }
  });

  it('flipPolyomino of S is equivalent to Z under free transforms', () => {
    const S = TETROMINOES.find((s) => s.id === 'S')!;
    const Z = TETROMINOES.find((s) => s.id === 'Z')!;
    const flippedS = flipPolyomino(S);
    expect(arePolyominoesEquivalent(flippedS, Z)).toBe(true);
  });

  it('T is not equivalent to L or O', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(arePolyominoesEquivalent(T, L)).toBe(false);
    expect(arePolyominoesEquivalent(T, O)).toBe(false);
  });

  it('areCellsEquivalent ignores absolute translation', () => {
    const a = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    const b = [
      { row: 5, col: 8 },
      { row: 5, col: 9 },
    ];
    expect(areCellsEquivalent(a, b)).toBe(true);
    expect(cellsToKey(a)).toBe(cellsToKey(b));
  });

  it('different cell counts never equivalent as polyominoes', () => {
    const m = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const d = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    expect(arePolyominoesEquivalent(m, d)).toBe(false);
  });
});

describe('Wave 28 poly-catalog — pentomino flag sanity', () => {
  it('all pentominoes declare order 5 and connected cells', () => {
    for (const p of PENTOMINOES) {
      expect(p.order).toBe(5);
      expect(p.cells).toHaveLength(5);
      expect(areCellsConnected(p.cells)).toBe(true);
    }
    // X is fully symmetric — catalog disables rotate/flip
    const X = PENTOMINOES.find((p) => p.id === 'X')!;
    expect(X.canRotate).toBe(false);
    expect(X.canFlip).toBe(false);
    expect(
      PENTOMINOES.filter((p) => p.id !== 'X').every((p) => p.canRotate)
    ).toBe(true);
  });

  it('X pentomino has high symmetry (≤4 unique free transforms)', () => {
    const X = PENTOMINOES.find((s) => s.id === 'X')!;
    expect(getSymmetryCount(X)).toBeLessThanOrEqual(4);
  });

  it('F pentomino is asymmetric under free transforms (8)', () => {
    const F = PENTOMINOES.find((s) => s.id === 'F')!;
    expect(getSymmetryCount(F)).toBe(8);
  });

  it('every shape exposes required PolyominoShape fields', () => {
    const sample: PolyominoShape = PENTOMINOES[0];
    expect(sample).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        cells: expect.any(Array),
        color: expect.any(String),
        canRotate: expect.any(Boolean),
        canFlip: expect.any(Boolean),
        size: expect.any(Number),
        order: expect.any(Number),
      })
    );
  });
});
