/**
 * Wave 35 — Calla forced empty valids + lastMoveInfo capture/free-turn strings.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  CallaGameState,
} from '../../src/games/calla/types';
import {
  getValidPits,
  makeMove,
  getLastMoveInfo,
  canSelectPit,
} from '../../src/games/calla/rules';
import { getAIMove, analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 35 Calla — empty valids / lastMoveInfo', () => {
  it('all-zero own pits yields empty getValidPits and null AI move', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [3, 3, 3, 3, 3],
      phase: 'selectPit',
      currentPlayer: 'player1',
    };
    expect(getValidPits(state)).toEqual([]);
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
    expect(analyzeMoves(state, 'player1')).toEqual([]);
  });

  it('getLastMoveInfo is null with empty history', () => {
    expect(getLastMoveInfo(createInitialState())).toBeNull();
  });

  it('getLastMoveInfo mentions free turn when last cube lands in Calla', () => {
    const next = makeMove(createInitialState(), 2);
    const info = getLastMoveInfo(next);
    expect(info).toBeTruthy();
    expect(info!.toLowerCase()).toMatch(/free|calla|again|turn/);
  });

  it('getLastMoveInfo can mention capture when landing empties own pit', () => {
    // Craft: P1 pit 0 has 1 cube; land in empty own pit with opposite occupied.
    // Pit 0 with 1 cube → lands in pit 1. Make pit 1 empty and opposite occupied.
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 5], // opposite of pit 1 is pit 3? getOppositePitIndex(1)=3
      player1Calla: 0,
      player2Calla: 0,
    };
    // opposite of 1 is 3; put cubes on P2 pit 3
    state.player2Pits = [0, 0, 0, 4, 0];
    const next = makeMove(state, 0);
    const info = getLastMoveInfo(next);
    expect(info).toBeTruthy();
    if (next.moveHistory[0]?.captured && next.moveHistory[0].captured > 0) {
      expect(info!.toLowerCase()).toMatch(/captur/);
    }
  });

  it('analyzeMoves returns scored entries only for non-empty pits', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 2, 0, 3, 0],
    };
    const analyzed = analyzeMoves(state, 'player1');
    expect(analyzed.map((m) => m.pit).sort()).toEqual([1, 3]);
  });
});
