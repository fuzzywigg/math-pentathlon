import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOppositePitIndex,
  isSideEmpty,
  getPlayerPits,
  getPlayerCalla,
  getSideTotalCubes,
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
  TOTAL_CUBES,
  CallaGameState,
} from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove,
  isGameOver,
  getPhaseMessage,
  getLastMoveInfo,
} from '../../src/games/calla/rules';

describe('Calla – opening constants and pit helpers', () => {
  it('exposes cube totals and opening pit/calla values', () => {
    expect(PITS_PER_SIDE).toBe(5);
    expect(INITIAL_CUBES_PER_PIT).toBe(3);
    expect(TOTAL_CUBES).toBe(30);

    const state = createInitialState();
    expect(getPlayerPits(state, 'player1')).toEqual([3, 3, 3, 3, 3]);
    expect(getPlayerPits(state, 'player2')).toEqual([3, 3, 3, 3, 3]);
    expect(getPlayerCalla(state, 'player1')).toBe(0);
    expect(getPlayerCalla(state, 'player2')).toBe(0);
    expect(getSideTotalCubes(state, 'player1')).toBe(
      PITS_PER_SIDE * INITIAL_CUBES_PER_PIT
    );
    expect(getSideTotalCubes(state, 'player2')).toBe(15);
  });
});

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

describe('Calla – capture / tie / last-move info / phases', () => {
  it('captures when last sow lands in empty own pit with opposite occupied', () => {
    // Sow 1 cube from pit 3 → lands in empty pit 4; opposite of 4 is opponent pit 0
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 1, 0],
      player2Pits: [4, 0, 0, 0, 0],
      player1Calla: 2,
      player2Calla: 0,
    };
    const beforeCalla = state.player1Calla;
    const next = makeMove(state, 3);

    expect(next.moveHistory[0].captured).toBeGreaterThan(0);
    expect(next.player1Calla).toBeGreaterThan(beforeCalla);
    expect(next.player2Pits[0]).toBe(0);
    expect(next.player1Pits[4]).toBe(0);
  });

  it('tie win when a side empties with equal callas after sweep', () => {
    // Last cube from pit 4 lands in calla → p1 side empty; sweep p2's 2 cubes
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [2, 0, 0, 0, 0],
      player1Calla: 10,
      player2Calla: 9, // +2 sweep → 11; p1 calla becomes 11
    };
    const next = makeMove(state, 4);
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBe('tie');
    expect(next.player1Calla).toBe(next.player2Calla);
  });

  it('getLastMoveInfo is null on fresh; includes Free turn / captured', () => {
    expect(getLastMoveInfo(createInitialState())).toBeNull();

    const free = makeMove(createInitialState(), 2);
    expect(getLastMoveInfo(free)).toMatch(/Free turn/);

    const captureState: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 1, 0],
      player2Pits: [3, 0, 0, 0, 0],
      player1Calla: 0,
      player2Calla: 0,
    };
    const captured = makeMove(captureState, 3);
    expect(getLastMoveInfo(captured)).toMatch(/captured/);
  });

  it('getPhaseMessage covers animating and tie', () => {
    const animating: CallaGameState = {
      ...createInitialState(),
      phase: 'animating',
    };
    expect(getPhaseMessage(animating)).toMatch(/distributing/i);

    const tie: CallaGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'tie',
    };
    expect(getPhaseMessage(tie)).toMatch(/tie/i);
  });
});
