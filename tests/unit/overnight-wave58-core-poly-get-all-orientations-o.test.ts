/**
 * Overnight HEAVY leftover after #274 — getAllOrientations(O) is unique singleton.
 * Distinct from wave57 symmetry-O count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllOrientations, TETROMINOES } from '../../src/core/polyomino';

describe('Wave 58 core poly — getAllOrientations O', () => {
  it('O-tetromino has exactly one unique orientation', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getAllOrientations(O)).toHaveLength(1);
  });
});
