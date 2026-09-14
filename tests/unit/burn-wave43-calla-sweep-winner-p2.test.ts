/**
 * Wave 43 — Calla sweep awards player2 when store higher. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — sweep winner player2', () => {
  it('emptying p1 side with p2 ahead yields player2', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [0, 0, 0, 0, 2],
      player1Calla: 10,
      player2Calla: 17,
    };
    const next = makeMove(state, 4);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
  });
});
