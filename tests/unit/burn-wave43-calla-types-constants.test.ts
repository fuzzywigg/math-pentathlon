/**
 * Wave 43 — Calla types constants + helpers leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
  TOTAL_CUBES,
  createInitialState,
  getOpponent,
  getPlayerPits,
  getPlayerCalla,
  isSideEmpty,
  getSideTotalCubes,
  getOppositePitIndex,
} from '../../src/games/calla/types';

describe('Wave 43 calla — types constants/helpers', () => {
  it('board constants: 5 pits × 3 cubes × 2 sides', () => {
    expect(PITS_PER_SIDE).toBe(5);
    expect(INITIAL_CUBES_PER_PIT).toBe(3);
    expect(TOTAL_CUBES).toBe(30);
  });

  it('createInitialState fills pits and zeros callas', () => {
    const s = createInitialState();
    expect(s.player1Pits).toEqual([3, 3, 3, 3, 3]);
    expect(s.player2Pits).toEqual([3, 3, 3, 3, 3]);
    expect(s.player1Calla).toBe(0);
    expect(s.player2Calla).toBe(0);
    expect(s.phase).toBe('selectPit');
    expect(s.winner).toBeNull();
  });

  it('seat helpers and opposite pit mirror', () => {
    const s = createInitialState();
    expect(getOpponent('player1')).toBe('player2');
    expect(getPlayerPits(s, 'player1')).toBe(s.player1Pits);
    expect(getPlayerCalla(s, 'player2')).toBe(0);
    expect(isSideEmpty(s, 'player1')).toBe(false);
    expect(getSideTotalCubes(s, 'player1')).toBe(15);
    expect(getOppositePitIndex(0)).toBe(4);
    expect(getOppositePitIndex(2)).toBe(2);
    expect(getOppositePitIndex(4)).toBe(0);
  });
});
