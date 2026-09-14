/**
 * Overnight HEAVY leftover after #234 — getPolyominoesByOrder(6) omits HEX_PATTERN_BLOCKS.
 * Distinct from burn-wave39-poly-simple-shapes-catalog. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPolyominoesByOrder,
  getPolyominoById,
} from '../../src/core/polyomino';

describe('Wave 52 core poly — order6 excludes hex', () => {
  it('order 6 catalog empty while hexagon lookup has order 6', () => {
    expect(getPolyominoesByOrder(6)).toEqual([]);
    expect(getPolyominoById('hexagon')?.order).toBe(6);
    expect(getPolyominoById('hexagon')?.cells).toHaveLength(1);
  });
});
