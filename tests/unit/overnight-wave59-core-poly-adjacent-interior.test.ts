/**
 * Overnight HEAVY leftover after #280 — interior getAdjacentCells ortho count.
 * Opposite of wave52 corner OOB adjacent leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  getAdjacentCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — adjacent interior', () => {
  it('interior monomino has four orthogonal neighbors', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const adj = getAdjacentCells(
      createGrid(5, 5),
      {
        polyomino: mono,
        position: { row: 2, col: 2 },
        rotation: 0,
        flipped: false,
      },
      false
    );
    expect(adj).toHaveLength(4);
  });
});
