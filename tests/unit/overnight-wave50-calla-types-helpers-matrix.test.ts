/**
 * Overnight HEAVY leftover — Calla types helpers leftover matrix.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPlayerPits,
  getPlayerCalla,
  isSideEmpty,
  getSideTotalCubes,
  getOppositePitIndex,
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
  TOTAL_CUBES,
} from '../../src/games/calla/types';

describe('Overnight wave50 calla — types leftover matrix', () => {
  it('opponent/pits/calla/side helpers stay symmetric', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(PITS_PER_SIDE * 2 * INITIAL_CUBES_PER_PIT).toBe(TOTAL_CUBES);
    expect([0, 1, 2, 3, 4].map(getOppositePitIndex)).toEqual([4, 3, 2, 1, 0]);

    const s = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [4, 0, 0, 0, 2],
      player1Calla: 9,
      player2Calla: 1,
    };
    expect(getPlayerPits(s, 'player1')).toBe(s.player1Pits);
    expect(getPlayerPits(s, 'player2')).toBe(s.player2Pits);
    expect(getPlayerCalla(s, 'player1')).toBe(9);
    expect(getPlayerCalla(s, 'player2')).toBe(1);
    expect(isSideEmpty(s, 'player1')).toBe(true);
    expect(isSideEmpty(s, 'player2')).toBe(false);
    expect(getSideTotalCubes(s, 'player1')).toBe(0);
    expect(getSideTotalCubes(s, 'player2')).toBe(6);
  });
});
