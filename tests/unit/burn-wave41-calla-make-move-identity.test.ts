/**
 * Wave 41 — Calla makeMove identity rejects.
 * Wrong phase / empty / OOB → same reference. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 41 calla — makeMove identity rejects', () => {
  it('wrong phase is identity for every pit index', () => {
    for (const phase of ['animating', 'gameOver'] as const) {
      const state: CallaGameState = {
        ...createInitialState(),
        phase,
        winner: phase === 'gameOver' ? 'player1' : null,
      };
      for (let i = 0; i < PITS_PER_SIDE; i++) {
        expect(makeMove(state, i)).toBe(state);
      }
    }
  });

  it('OOB pit indexes are identity', () => {
    const state = createInitialState();
    for (const i of [-1, PITS_PER_SIDE, 50, -99]) {
      expect(makeMove(state, i)).toBe(state);
    }
  });

  it('empty pit is identity; neighboring filled pit mutates', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 3, 0, 0, 0],
    };
    expect(makeMove(state, 0)).toBe(state);
    const next = makeMove(state, 1);
    expect(next).not.toBe(state);
    expect(next.player1Pits[1]).toBe(0);
    expect(next.moveHistory).toHaveLength(1);
  });

  it('gameOver with winner still identity even if pits look playable', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'tie',
      player1Pits: [3, 3, 3, 3, 3],
    };
    expect(makeMove(state, 2)).toBe(state);
  });
});
