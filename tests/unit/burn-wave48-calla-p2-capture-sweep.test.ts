/**
 * Wave 48 — Calla P2 capture then emptying own side sweeps P1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — P2 capture sweep', () => {
  it('P2 capture that empties own side ends with sweep', () => {
    // P2 pit0=1 lands pit1 empty with opp opposite having cubes; only one P2 pit non-empty after?
    const state: CallaGameState = {
      ...createInitialState(),
      currentPlayer: 'player2',
      player1Pits: [0, 0, 0, 3, 0],
      player2Pits: [1, 0, 0, 0, 0],
      player1Calla: 5,
      player2Calla: 5,
    };
    const next = makeMove(state, 0);
    // pit0→pit1: if pit1 was 0 and opposite of pit1 (index 3) has 3 → capture
    expect(next.moveHistory[0].captured).toBeGreaterThan(0);
    expect(next.phase).toBe('gameOver');
    expect(next.player1Pits.every((c) => c === 0)).toBe(true);
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
  });
});
