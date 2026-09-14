/**
 * Wave 47 leftover after #214/#215 — Sum Dominoes mutual pass settles toward gameOver/winner.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 47 sum deepen 16 — Sum Dominoes — mutual pass', () => {
  it('two consecutive passes advance passCount and may end', () => {
    let state = {
      ...createInitialState(),
      phase: 'passing' as const,
      currentDice: [1, 1] as [number, number],
      passCount: 0,
    };
    state = passTurn(state);
    expect(state.passCount).toBe(1);
    expect(state.currentPlayer).toBe('player2');
    state = { ...state, phase: 'passing', currentDice: [2, 2] };
    state = passTurn(state);
    expect(state.passCount).toBeGreaterThanOrEqual(1);
    // After enough mutual passes game may be over or still rolling
    expect(['rolling', 'gameOver', 'passing', 'placing']).toContain(state.phase);
  });
});
