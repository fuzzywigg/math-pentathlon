/**
 * Wave 38 — getShapesBySize / getPolyominoesByOrder parity leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SIMPLE_SHAPES,
  TETROMINOES,
  PENTOMINOES,
  getShapesBySize,
  getPolyominoesByOrder,
  getPolyominoById,
} from '../../src/core/polyomino';

describe('Wave 38 poly-catalog — size / order edges', () => {
  it('order 0 and 99 return empty', () => {
    expect(getPolyominoesByOrder(0)).toEqual([]);
    expect(getPolyominoesByOrder(99)).toEqual([]);
    expect(getShapesBySize(0, TETROMINOES)).toEqual([]);
    expect(getShapesBySize(99, PENTOMINOES)).toEqual([]);
  });

  it('order 4 matches tetromino size filter', () => {
    const byOrder = getPolyominoesByOrder(4);
    const bySize = getShapesBySize(4, [
      ...SIMPLE_SHAPES,
      ...TETROMINOES,
      ...PENTOMINOES,
    ]);
    expect(byOrder.map((s) => s.id).sort()).toEqual(
      bySize.map((s) => s.id).sort()
    );
    expect(byOrder.every((s) => s.order === 4 || s.size === 4)).toBe(true);
  });

  it('known ids resolve across catalogs', () => {
    expect(getPolyominoById(TETROMINOES[0].id)?.id).toBe(TETROMINOES[0].id);
    expect(getPolyominoById(PENTOMINOES[0].id)?.id).toBe(PENTOMINOES[0].id);
  });

  it('size 5 pentominoes are non-empty and unique ids', () => {
    const p5 = getShapesBySize(5, PENTOMINOES);
    expect(p5.length).toBeGreaterThan(0);
    const ids = new Set(p5.map((s) => s.id));
    expect(ids.size).toBe(p5.length);
  });
});
