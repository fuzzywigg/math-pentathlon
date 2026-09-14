/**
 * Overnight HEAVY leftover after #264 — arePolyominoesEquivalent under flip.
 * Distinct from wave55 flip ignores canFlip flag. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  SIMPLE_SHAPES,
  arePolyominoesEquivalent,
  flipPolyomino,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — equivalent under flip', () => {
  it('L-tromino matches its flip; differs from I-tromino', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const I = SIMPLE_SHAPES.find((s) => s.id === 'tromino-I')!;
    expect(arePolyominoesEquivalent(L, flipPolyomino(L))).toBe(true);
    expect(arePolyominoesEquivalent(L, I)).toBe(false);
  });
});
