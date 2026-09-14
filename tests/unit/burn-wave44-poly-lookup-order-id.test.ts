/**
 * Wave 44 — getPolyominoById / getPolyominoesByOrder leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPolyominoById,
  getPolyominoesByOrder,
  getShapeById,
  getShapesBySize,
  PENTOMINOES,
  HEX_PATTERN_BLOCKS,
} from '../../src/core/polyomino';

describe('Wave 44 poly — lookup by id/order', () => {
  it('finds hexagon and X; order 5 returns pentominoes', () => {
    expect(getPolyominoById('hexagon')?.name).toBe('Hexagon');
    expect(getPolyominoById('X')?.size).toBe(5);
    expect(getPolyominoById('missing')).toBeUndefined();
    const order5 = getPolyominoesByOrder(5);
    expect(order5.every((s) => s.order === 5)).toBe(true);
    expect(order5.length).toBe(PENTOMINOES.length);
    expect(getShapeById('triangle', HEX_PATTERN_BLOCKS)?.size).toBe(1);
    expect(getShapesBySize(4, PENTOMINOES)).toHaveLength(0);
  });
});
