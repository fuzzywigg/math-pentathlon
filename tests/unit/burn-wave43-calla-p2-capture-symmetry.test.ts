/**
 * Wave 43 — Calla player2 capture symmetry leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — player2 capture', () => {
  it('player2 captures opposite when landing empty own pit', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player1Pits: [0, 0, 0, 0, 4],
      player2Pits: [0, 0, 0, 1, 0],
      player1Calla: 0,
      player2Calla: 0,
    };
    // p2 sow pit3 (1): lands pit4 empty → opposite of 4 is 0 → p1 pit0 is 0, no capture
    // Need opposite with cubes: pitIndex 0 opposite is 4.
    const captureState = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player2Pits: [1, 0, 0, 0, 0],
      player1Pits: [0, 0, 0, 0, 6], // opposite of landing?
    };
    // sow pit0 with 1: next is pit1. Need land on empty own with opp cubes.
    // player2Pits [0,0,0,0,1] sow 4 → calla free turn.
    // player2Pits [0,0,0,1,0] and land on pit4 empty: sow 3 with 1 → land 4.
    // opposite of 4 is 0. Put cubes in player1 pit0.
    const s = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player2Pits: [0, 0, 0, 1, 0],
      player1Pits: [5, 0, 0, 0, 0],
    };
    const next = makeMove(s, 3);
    expect(next.moveHistory[0].captured).toBeGreaterThan(0);
    expect(next.player2Calla).toBeGreaterThan(0);
    expect(next.player1Pits[0]).toBe(0);
  });
});
