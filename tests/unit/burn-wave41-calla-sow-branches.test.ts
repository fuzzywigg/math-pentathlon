/**
 * Wave 41 — Calla makeMove sow / free-turn / turn-switch leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import {
  makeMove,
  canSelectPit,
  getValidPits,
} from '../../src/games/calla/rules';

function base(overrides: Partial<CallaGameState> = {}): CallaGameState {
  return { ...createInitialState(), ...overrides };
}

describe('Wave 41 Calla — sow branches', () => {
  it('opening pit 2 with 3 cubes lands in calla and grants free turn', () => {
    const next = makeMove(createInitialState(), 2);
    expect(next.player1Pits[2]).toBe(0);
    expect(next.player1Calla).toBe(1);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.moveHistory[0].cubesDistributed).toBe(3);
    expect(next.currentPlayer).toBe('player1');
    expect(next.lastSownPit).toEqual({ side: 'calla', index: 0 });
  });

  it('sow wraps into opponent pits without free turn', () => {
    // Keep other own pits non-empty so emptying pit4 does not end the game
    const state = base({
      player1Pits: [2, 0, 0, 0, 3],
      player2Pits: [1, 1, 1, 1, 1],
    });
    const next = makeMove(state, 4);
    expect(next.player1Pits[4]).toBe(0);
    expect(next.moveHistory[0].gotFreeTurn).toBe(false);
    expect(next.currentPlayer).toBe('player2');
    expect(next.lastSownPit?.side).toBe('player2');
    expect(next.phase).toBe('selectPit');
  });

  it('player2 sowing grants free turn when landing in own calla', () => {
    const state = base({
      currentPlayer: 'player2',
      player1Pits: [2, 2, 2, 2, 2],
      player2Pits: [0, 0, 3, 0, 0],
    });
    const next = makeMove(state, 2);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.player2Calla).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });

  it('animating phase rejects selection; makeMove is identity', () => {
    const state = base({ phase: 'animating' });
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(getValidPits(state)).toEqual([]);
    expect(makeMove(state, 0)).toBe(state);
  });

  it('out-of-range pit index cannot be selected', () => {
    const state = createInitialState();
    expect(canSelectPit(state, 'player1', -1)).toBe(false);
    expect(canSelectPit(state, 'player1', 5)).toBe(false);
    expect(makeMove(state, 5)).toBe(state);
  });

  it('multi-cube sow empties source and records moveNumber', () => {
    const state = base({
      player1Pits: [5, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 0,
      player2Calla: 10,
    });
    const next = makeMove(state, 0);
    expect(next.player1Pits[0]).toBe(0);
    expect(next.moveHistory[0].moveNumber).toBe(1);
    expect(next.moveHistory[0].cubesDistributed).toBe(5);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
  });
});
