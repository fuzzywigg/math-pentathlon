/**
 * Wave 41 — Calla wrong-seat framing via makeMove after free-turn stay.
 * Seat identity: opponent pits not sowable by current. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import {
  canSelectPit,
  makeMove,
  getValidPits,
} from '../../src/games/calla/rules';

describe('Wave 41 calla — seat identity after free turn', () => {
  it('free-turn keeps seat; opponent still cannot select', () => {
    const next = makeMove(createInitialState(), 2);
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    for (let i = 0; i < PITS_PER_SIDE; i++) {
      expect(canSelectPit(next, 'player2', i)).toBe(false);
    }
    expect(getValidPits(next).every((i) => next.player1Pits[i] > 0)).toBe(
      true
    );
  });

  it('player2 seat: canSelectPit only for red pits', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      currentPlayer: 'player2',
      player1Pits: [5, 5, 5, 5, 5],
      player2Pits: [0, 0, 2, 0, 0],
    };
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(canSelectPit(state, 'player2', 2)).toBe(true);
    expect(canSelectPit(state, 'player2', 0)).toBe(false);
    expect(makeMove(state, 0)).toBe(state);
    const moved = makeMove(state, 2);
    expect(moved).not.toBe(state);
  });
});
