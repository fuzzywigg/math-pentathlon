/**
 * Overnight HEAVY leftover after #280 — findValidPlacements on empty board.
 * Distinct from wave58 validate failure reasons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  findValidPlacements,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — find valid placements empty', () => {
  it('empty 3x3 admits monomino at every cell', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    expect(findValidPlacements(createBoard(3, 3), mono)).toHaveLength(9);
  });
});
