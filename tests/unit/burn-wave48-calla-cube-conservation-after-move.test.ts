/**
 * Wave 48 — Calla TOTAL_CUBES conserved after sow (leftover invariant). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TOTAL_CUBES, getSideTotalCubes, getPlayerCalla } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — cube conservation', () => {
  it('pits + callas sum to TOTAL_CUBES after opening sow', () => {
    const next = makeMove(createInitialState(), 0);
    const total =
      getSideTotalCubes(next, 'player1') +
      getSideTotalCubes(next, 'player2') +
      getPlayerCalla(next, 'player1') +
      getPlayerCalla(next, 'player2');
    expect(total).toBe(TOTAL_CUBES);
  });
});
