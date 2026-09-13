import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOppositePitIndex,
  isSideEmpty,
  CallaGameState,
} from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove,
  isGameOver,
  getPhaseMessage,
} from '../../src/games/calla/rules';

describe('Calla – selection helpers', () => {
  it('maps opposite pit indices across the board', () => {
    expect(getOppositePitIndex(0)).toBe(4);
    expect(getOppositePitIndex(2)).toBe(2);
    expect(getOppositePitIndex(4)).toBe(0);
  });

  it('exposes all five pits as valid on a fresh board', () => {
    const state = createInitialState();
    expect(getValidPits(state)).toEqual([0, 1, 2, 3, 4]);
    expect(canSelectPit(state, 'player1', 0)).toBe(true);
    expect(canSelectPit(state, 'player2', 0)).toBe(false);
  });

  it('rejects empty pits and out-of-range indexes', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 3, 3, 3, 3],
    };
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(makeMove(state, 0)).toBe(state);
    expect(canSelectPit(state, 'player1', 99)).toBe(false);
  });
});

describe('Calla – makeMove', () => {
  it('distributes cubes from pit 0 and records the move', () => {
    const state = createInitialState();
    const next = makeMove(state, 0);

    expect(next).not.toBe(state);
    expect(next.player1Pits[0]).toBe(0);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].cubesDistributed).toBe(3);
    expect(next.currentPlayer).toBe('player2');
  });

  it('awards a free turn when the last cube lands in the Calla', () => {
    // Pit 2 with 3 cubes: positions 3, 4, then Calla (index 5)
    const state = createInitialState();
    const next = makeMove(state, 2);

    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player1');
    expect(next.player1Calla).toBeGreaterThan(0);
  });

  it('ends the game and sweeps when a side empties', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [2, 2, 2, 2, 2],
      player1Calla: 5,
      player2Calla: 5,
    };
    const next = makeMove(state, 0);

    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(isSideEmpty(next, 'player1')).toBe(true);
    expect(next.winner).not.toBeNull();
  });

  it('getPhaseMessage covers select and game-over cases', () => {
    const playing = createInitialState();
    expect(getPhaseMessage(playing)).toMatch(/Blue/);

    const over: CallaGameState = {
      ...playing,
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(getPhaseMessage(over)).toMatch(/wins/i);
  });
});
