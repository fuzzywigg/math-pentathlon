/**
 * Wave 41 — Calla getValidPits phase guard + sparse-pit matrix.
 * Wrong phase → []; sparse zeros filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';

describe('Wave 41 calla — getValidPits phase', () => {
  it('opening yields all five pit indexes', () => {
    expect(getValidPits(createInitialState())).toEqual([0, 1, 2, 3, 4]);
  });

  it('animating and gameOver yield empty valids', () => {
    expect(
      getValidPits({ ...createInitialState(), phase: 'animating' })
    ).toEqual([]);
    expect(
      getValidPits({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toEqual([]);
  });

  it('sparse own pits returns only non-zero indexes', () => {
    const cases: { pits: number[]; expect: number[] }[] = [
      { pits: [0, 0, 0, 0, 0], expect: [] },
      { pits: [3, 0, 0, 0, 0], expect: [0] },
      { pits: [0, 0, 1, 0, 2], expect: [2, 4] },
      { pits: [1, 1, 1, 1, 1], expect: [0, 1, 2, 3, 4] },
      { pits: [0, 5, 0, 5, 0], expect: [1, 3] },
    ];
    for (const c of cases) {
      const state: CallaGameState = {
        ...createInitialState(),
        player1Pits: c.pits,
        player2Pits: [9, 9, 9, 9, 9],
      };
      expect(getValidPits(state)).toEqual(c.expect);
    }
  });

  it('uses currentPlayer pits when seat is player2', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      currentPlayer: 'player2',
      player1Pits: [9, 9, 9, 9, 9],
      player2Pits: [0, 2, 0, 0, 4],
    };
    expect(getValidPits(state)).toEqual([1, 4]);
  });
});
