/**
 * Wave 43 — Calla type helpers opposite/side totals leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOppositePitIndex,
  getSideTotalCubes,
  isSideEmpty,
  getPlayerCalla,
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
} from '../../src/games/calla/types';

describe('Wave 43 calla — types helpers matrix', () => {
  it('opposite is symmetric; side totals match opening', () => {
    for (let i = 0; i < PITS_PER_SIDE; i++) {
      expect(getOppositePitIndex(getOppositePitIndex(i))).toBe(i);
    }
    const s = createInitialState();
    expect(getSideTotalCubes(s, 'player1')).toBe(PITS_PER_SIDE * INITIAL_CUBES_PER_PIT);
    expect(isSideEmpty(s, 'player1')).toBe(false);
    expect(getPlayerCalla(s, 'player1')).toBe(0);
    const empty = { ...s, player1Pits: [0, 0, 0, 0, 0] };
    expect(isSideEmpty(empty, 'player1')).toBe(true);
  });
});
