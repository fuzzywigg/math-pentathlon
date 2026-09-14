/**
 * Overnight HEAVY leftover after #280 — validatePlacement success path.
 * Opposite of wave58 OOB/occupied reason leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  validatePlacement,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — validate valid true', () => {
  it('in-bounds empty monomino is valid without reason', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const result = validatePlacement(createBoard(2, 2), mono, {
      row: 0,
      col: 1,
    });
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
    expect(result.cells).toEqual([{ row: 0, col: 1 }]);
  });
});
