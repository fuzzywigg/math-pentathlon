/**
 * Wave 41 — Calla makeMove capture + free-turn in calla.
 * Dense craft boards for sow landings. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 41 calla — capture + free turn', () => {
  it('free turn when last cube lands in own calla (pit 2 × 3)', () => {
    const next = makeMove(createInitialState(), 2);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.moveHistory[0].captured).toBe(0);
    expect(next.currentPlayer).toBe('player1');
    expect(next.player1Calla).toBe(1);
    expect(next.lastSownPit).toEqual({ side: 'calla', index: 0 });
  });

  it('no free turn when sow ends on own pit (pit 0 × 3)', () => {
    const next = makeMove(createInitialState(), 0);
    expect(next.moveHistory[0].gotFreeTurn).toBe(false);
    expect(next.currentPlayer).toBe('player2');
  });

  it('capture: 1 cube from pit 3 into empty pit 4 with opposite occupied', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 1, 0],
      player2Pits: [5, 0, 0, 0, 0], // opposite of 4 is 0
      player1Calla: 1,
      player2Calla: 0,
    };
    const next = makeMove(state, 3);
    expect(next.moveHistory[0].captured).toBe(6); // 5 opposite + capturing cube
    expect(next.player1Pits[4]).toBe(0);
    expect(next.player2Pits[0]).toBe(0);
    expect(next.player1Calla).toBe(1 + 6);
    expect(getLastMoveInfo(next)).toMatch(/captured/);
  });

  it('no capture when opposite pit is empty', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 1, 0],
      // Keep p2 non-empty so game does not sweep; opposite of pit 4 is 0
      player2Pits: [0, 2, 0, 0, 0],
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = makeMove(state, 3);
    expect(next.moveHistory[0].captured).toBe(0);
    expect(next.player1Pits[4]).toBe(1);
    expect(next.phase).toBe('selectPit');
  });

  it('player2 free turn when last sow lands in red calla', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      currentPlayer: 'player2',
      player2Pits: [0, 0, 3, 0, 0],
      player1Pits: [1, 1, 1, 1, 1],
    };
    const next = makeMove(state, 2);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player2');
    expect(next.player2Calla).toBe(1);
    expect(getLastMoveInfo(next)).toMatch(/Free turn/);
  });
});
