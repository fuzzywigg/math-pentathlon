/**
 * Wave 41 — Calla canSelectPit dense reject matrix.
 * Phase / seat / OOB / empty-pit gates → false. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
  type Player,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import { canSelectPit } from '../../src/games/calla/rules';

describe('Wave 41 calla — canSelectPit matrix', () => {
  it('opening: current seat true on every pit, wrong seat false', () => {
    const state = createInitialState();
    for (let i = 0; i < PITS_PER_SIDE; i++) {
      expect(canSelectPit(state, 'player1', i)).toBe(true);
      expect(canSelectPit(state, 'player2', i)).toBe(false);
    }
  });

  it('wrong phase rejects every seat/pit combo', () => {
    const phases: CallaGameState['phase'][] = ['animating', 'gameOver'];
    for (const phase of phases) {
      const state: CallaGameState = { ...createInitialState(), phase };
      for (const seat of ['player1', 'player2'] as Player[]) {
        for (let i = -1; i <= PITS_PER_SIDE; i++) {
          expect(canSelectPit(state, seat, i)).toBe(false);
        }
      }
    }
  });

  it('OOB indexes reject for current seat', () => {
    const state = createInitialState();
    for (const i of [-2, -1, PITS_PER_SIDE, PITS_PER_SIDE + 3, 99]) {
      expect(canSelectPit(state, 'player1', i)).toBe(false);
    }
  });

  it('empty pit rejects; non-empty still selectable', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 1, 0, 2, 0],
    };
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(canSelectPit(state, 'player1', 1)).toBe(true);
    expect(canSelectPit(state, 'player1', 2)).toBe(false);
    expect(canSelectPit(state, 'player1', 3)).toBe(true);
    expect(canSelectPit(state, 'player1', 4)).toBe(false);
  });
});
