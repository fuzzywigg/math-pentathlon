/**
 * Overnight HEAVY leftover after #280 — getAllRotations(I) unique pair.
 * Distinct from wave58 getAllOrientations(O) singleton. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllRotations, TETROMINOES } from '../../src/core/polyomino';

describe('Wave 59 core poly — get all rotations I', () => {
  it('I-tetromino has exactly two unique rotations', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    expect(getAllRotations(I.cells)).toHaveLength(2);
  });
});
