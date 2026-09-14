/**
 * Wave 46 — Pent canPlacePiece true at opening leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { canPlacePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — canPlace true', () => {
  it('X at center is placeable on empty board', () => {
    expect(canPlacePiece(createInitialState(), 'X', { row: 4, col: 4 }, 0, false)).toBe(
      true
    );
  });
});
