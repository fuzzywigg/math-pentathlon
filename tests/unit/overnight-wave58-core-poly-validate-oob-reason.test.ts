/**
 * Overnight HEAVY leftover after #274 — validatePlacement OOB reason string.
 * Distinct from wave57 canPlace full false. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  validatePlacement,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — validate OOB reason', () => {
  it('out-of-bounds placement reports boundary reason', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const result = validatePlacement(createBoard(2, 2), mono, {
      row: -1,
      col: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Shape extends beyond board boundaries');
  });
});
