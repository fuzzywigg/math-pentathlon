/**
 * Wave 48 — Calla getValidPits skips zero pits. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';

describe('Wave 48 calla — valid pits partial', () => {
  it('only nonzero pits are valid', () => {
    const s = {
      ...createInitialState(),
      player1Pits: [0, 2, 0, 4, 0],
    };
    expect(getValidPits(s)).toEqual([1, 3]);
  });
});
