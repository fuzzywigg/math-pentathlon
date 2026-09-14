/**
 * Wave 44 — solvePlacement tiny board leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  solvePlacement,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 44 poly — solve two monominoes', () => {
  it('fills 1x2 with two singles', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const a = { ...mono, id: 'm1' };
    const b = { ...mono, id: 'm2' };
    const sols = solvePlacement(createBoard(1, 2), [a, b], 2);
    expect(sols.length).toBeGreaterThanOrEqual(1);
    expect(sols[0]).toHaveLength(2);
  });
});
