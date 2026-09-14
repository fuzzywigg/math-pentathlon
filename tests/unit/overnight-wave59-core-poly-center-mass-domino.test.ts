/**
 * Overnight HEAVY leftover after #280 — non-empty getCenterOfMass average.
 * Opposite of wave57 empty COM → origin. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getCenterOfMass, SIMPLE_SHAPES } from '../../src/core/polyomino';

describe('Wave 59 core poly — center mass domino', () => {
  it('horizontal domino COM averages to half-column', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    expect(getCenterOfMass(domino.cells)).toEqual({ row: 0, col: 0.5 });
  });
});
