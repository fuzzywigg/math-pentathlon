/**
 * Wave 41 — Calla phase messages + lastMoveInfo leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import {
  getPhaseMessage,
  getLastMoveInfo,
  makeMove,
  getValidPits,
  canSelectPit,
} from '../../src/games/calla/rules';

describe('Wave 41 Calla — phase / lastMoveInfo', () => {
  it('selectPit messages name Blue then Red by seat', () => {
    const p1 = createInitialState();
    expect(getPhaseMessage(p1)).toMatch(/Blue.*Select a shield/);
    const p2: CallaGameState = { ...p1, currentPlayer: 'player2' };
    expect(getPhaseMessage(p2)).toMatch(/Red.*Select a shield/);
  });

  it('animating phase message names current seat', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      phase: 'animating',
      currentPlayer: 'player2',
    };
    expect(getPhaseMessage(state)).toMatch(/Red is distributing/);
  });

  it('getLastMoveInfo singular cube wording without free turn', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 2, 2, 2, 2],
      player2Pits: [3, 3, 3, 3, 3],
    };
    const next = makeMove(state, 0);
    const info = getLastMoveInfo(next)!;
    expect(info).toContain('Blue distributed 1 cube');
    expect(info).not.toContain('cubes');
    expect(info).not.toMatch(/Free turn/);
  });

  it('getLastMoveInfo free turn after landing in calla', () => {
    const next = makeMove(createInitialState(), 2);
    expect(getLastMoveInfo(next)).toMatch(/Free turn!/);
  });

  it('getValidPits lists only non-empty current-player pits', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 4, 0, 1, 0],
      player2Pits: [9, 9, 9, 9, 9],
    };
    expect(getValidPits(state)).toEqual([1, 3]);
    expect(canSelectPit(state, 'player1', 1)).toBe(true);
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
  });

  it('empty history returns null lastMoveInfo', () => {
    expect(getLastMoveInfo(createInitialState())).toBeNull();
  });
});
