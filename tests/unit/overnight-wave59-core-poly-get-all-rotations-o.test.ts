/**
 * Overnight HEAVY leftover after #280 — getAllRotations(O) cells singleton.
 * Distinct from wave58 getAllOrientations(O) shape API. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllRotations, TETROMINOES } from '../../src/core/polyomino';

describe('Wave 59 core poly — get all rotations O', () => {
  it('O-tetromino cells have exactly one unique rotation', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getAllRotations(O.cells)).toHaveLength(1);
  });
});
