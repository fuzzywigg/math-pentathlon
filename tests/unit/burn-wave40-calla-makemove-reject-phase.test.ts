/**
 * Wave 40 — Calla makeMove / canSelectPit / phase message leftovers.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canSelectPit,
  getValidPits,
  makeMove,
  getPhaseMessage,
  getLastMoveInfo,
  isGameOver,
} from '../../src/games/calla/rules';
import { createInitialState } from '../../src/games/calla/types';

describe('Wave 40 calla — makeMove reject + messaging', () => {
  it('canSelectPit / getValidPits empty outside selectPit', () => {
    const state = {
      ...createInitialState(),
      phase: 'animating' as const,
    };
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(getValidPits(state)).toEqual([]);
  });

  it('makeMove identity on empty pit / wrong seat / OOB', () => {
    const state = createInitialState();
    const empty = {
      ...state,
      player1Pits: [0, 3, 3, 3, 3],
    };
    expect(makeMove(empty, 0)).toBe(empty);
    expect(makeMove(state, -1)).toBe(state);
    expect(makeMove(state, 99)).toBe(state);
    expect(canSelectPit(state, 'player2', 0)).toBe(false);
  });

  it('successful sow updates history; getLastMoveInfo null when empty', () => {
    const state = createInitialState();
    expect(getLastMoveInfo(state)).toBeNull();
    expect(getPhaseMessage(state)).toMatch(/Blue|Select/i);
    const next = makeMove(state, 0);
    expect(next).not.toBe(state);
    expect(next.moveHistory.length).toBe(1);
    expect(getLastMoveInfo(next)).toMatch(/Blue|distributed/i);
    expect(isGameOver(next)).toBe(false);
  });

  it('gameOver phase message covers tie + winner branches', () => {
    const tie = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'tie' as const,
    };
    expect(getPhaseMessage(tie)).toMatch(/tie/i);
    const p2 = { ...tie, winner: 'player2' as const };
    expect(getPhaseMessage(p2)).toMatch(/Red|wins/i);
  });
});
