/**
 * Wave 43 — Calla gameOver settle win/tie leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, isGameOver, getPhaseMessage } from '../../src/games/calla/rules';

function base(overrides: Partial<CallaGameState> = {}): CallaGameState {
  return { ...createInitialState(), ...overrides };
}

describe('Wave 43 calla — gameOver tie/win', () => {
  it('emptying own side sweeps remainder and settles a winner', () => {
    const state = base({
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [2, 2, 2, 2, 2],
      player1Calla: 10,
      player2Calla: 0,
    });
    const next = makeMove(state, 0);
    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
    expect(next.player1Pits.every((c) => c === 0)).toBe(true);
    expect(['player1', 'player2', 'tie']).toContain(next.winner as string);
    expect(next.player1Calla + next.player2Calla).toBe(21);
  });

  it('tie when callas finish equal after emptying side', () => {
    // pit4 with 1 cube lands in own calla; p2 already empty → game over; 14+1 vs 15 → tie.
    const state = base({
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 14,
      player2Calla: 15,
    });
    const next = makeMove(state, 4);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('tie');
    expect(next.player1Calla).toBe(15);
    expect(next.player2Calla).toBe(15);
  });

  it('getPhaseMessage covers select/animating/tie/win', () => {
    expect(getPhaseMessage(createInitialState())).toMatch(/Select/);
    expect(getPhaseMessage(base({ phase: 'animating' }))).toMatch(/distributing/);
    expect(getPhaseMessage(base({ phase: 'gameOver', winner: 'tie' }))).toMatch(/tie/i);
    expect(getPhaseMessage(base({ phase: 'gameOver', winner: 'player1' }))).toMatch(/wins/);
  });
});
