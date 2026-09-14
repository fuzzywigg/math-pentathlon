/**
 * Overnight HEAVY leftover after #274 — getShapesBySize(5) on pentominoes.
 * Distinct from burn-wave28 tetromino size 4. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getShapesBySize, PENTOMINOES } from '../../src/core/polyomino';

describe('Wave 58 core poly — shapes by size pent', () => {
  it('all 12 pentominoes have size 5', () => {
    expect(getShapesBySize(5, PENTOMINOES)).toHaveLength(12);
    expect(getShapesBySize(4, PENTOMINOES)).toEqual([]);
  });
});
