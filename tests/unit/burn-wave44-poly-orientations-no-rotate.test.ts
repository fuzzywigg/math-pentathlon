/**
 * Wave 44 — getAllOrientations canRotate=false leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllOrientations, TETROMINOES } from '../../src/core/polyomino';

describe('Wave 44 poly — orientations no-rotate', () => {
  it('O-tetromino has single orientation', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(O.canRotate).toBe(false);
    expect(getAllOrientations(O)).toHaveLength(1);
  });
});
