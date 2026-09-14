/**
 * Wave 41 — Calla types helper leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPlayerPits,
  getPlayerCalla,
  isSideEmpty,
  getSideTotalCubes,
  getOppositePitIndex,
  getOpponent,
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
  TOTAL_CUBES,
  type CallaGameState,
} from '../../src/games/calla/types';

describe('Wave 41 Calla — types helpers', () => {
  it('getPlayerPits / getPlayerCalla route by seat', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 2, 3, 4, 5],
      player2Pits: [9, 8, 7, 6, 0],
      player1Calla: 11,
      player2Calla: 22,
    };
    expect(getPlayerPits(state, 'player1')).toEqual([1, 2, 3, 4, 5]);
    expect(getPlayerPits(state, 'player2')).toEqual([9, 8, 7, 6, 0]);
    expect(getPlayerCalla(state, 'player1')).toBe(11);
    expect(getPlayerCalla(state, 'player2')).toBe(22);
  });

  it('isSideEmpty and getSideTotalCubes track pit cubes only', () => {
    const emptyP1: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      player1Calla: 30,
      player2Pits: [1, 0, 2, 0, 3],
    };
    expect(isSideEmpty(emptyP1, 'player1')).toBe(true);
    expect(isSideEmpty(emptyP1, 'player2')).toBe(false);
    expect(getSideTotalCubes(emptyP1, 'player1')).toBe(0);
    expect(getSideTotalCubes(emptyP1, 'player2')).toBe(6);
  });

  it('getOppositePitIndex is involution across all pits', () => {
    for (let i = 0; i < PITS_PER_SIDE; i++) {
      const opp = getOppositePitIndex(i);
      expect(opp).toBe(PITS_PER_SIDE - 1 - i);
      expect(getOppositePitIndex(opp)).toBe(i);
    }
  });

  it('getOpponent flips seats; constants match board layout', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(PITS_PER_SIDE).toBe(5);
    expect(INITIAL_CUBES_PER_PIT).toBe(3);
    expect(TOTAL_CUBES).toBe(PITS_PER_SIDE * 2 * INITIAL_CUBES_PER_PIT);
  });

  it('createInitialState fills both sides evenly', () => {
    const s = createInitialState();
    expect(getSideTotalCubes(s, 'player1')).toBe(15);
    expect(getSideTotalCubes(s, 'player2')).toBe(15);
    expect(isSideEmpty(s, 'player1')).toBe(false);
    expect(s.player1Calla + s.player2Calla).toBe(0);
  });
});
