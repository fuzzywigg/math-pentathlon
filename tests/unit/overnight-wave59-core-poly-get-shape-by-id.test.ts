/**
 * Overnight HEAVY leftover after #280 — getShapeById hit/miss dual.
 * Distinct from wave58 getPolyominoById / shapes-by-size. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getShapeById, TETROMINOES } from '../../src/core/polyomino';

describe('Wave 59 core poly — get shape by id', () => {
  it('finds T in TETROMINOES and misses unknown id', () => {
    expect(getShapeById('T', TETROMINOES)?.name).toBe('T-tetromino');
    expect(getShapeById('ZZ', TETROMINOES)).toBeUndefined();
  });
});
