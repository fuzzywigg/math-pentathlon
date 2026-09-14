/**
 * Overnight HEAVY leftover after #274 — solvePlacement with empty shape list.
 * Distinct from wave57 solve monomino. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createBoard, solvePlacement } from '../../src/core/polyomino';

describe('Wave 58 core poly — solve empty shapes', () => {
  it('unfilled board + [] shapes yields empty solution list', () => {
    expect(solvePlacement(createBoard(2, 2), [], 1)).toEqual([]);
  });
});
