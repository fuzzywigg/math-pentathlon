/**
 * Wave 43 — Calla P2 capture then empty-side sweep leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, isGameOver, getPhaseMessage } from '../../src/games/calla/rules';

function base(o: Partial<CallaGameState> = {}): CallaGameState {
  return { ...createInitialState(), ...o };
}

describe('Wave 43 calla — P2 capture sweep', () => {
  it('P2 capture emptying own side sweeps remaining and settles winner', () => {
    // P2 pit0 has 1 cube; sowing into empty pit1 with opp opposite having cubes
    // opposite of pit1 is 3. Land on empty own pit with capture that empties side.
    const state = base({
      currentPlayer: 'player2',
      player1Pits: [0, 0, 0, 4, 0],
      player2Pits: [1, 0, 0, 0, 0],
      player1Calla: 10,
      player2Calla: 10,
    });
    // sow pit0 (1 cube) -> lands pit1 which is empty; opposite of 1 is 3 with 4 cubes -> capture
    const next = makeMove(state, 0);
    expect(next.phase).toBe('gameOver');
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).not.toBeNull();
    expect(getPhaseMessage(next)).toMatch(/wins|tie/i);
  });
});
