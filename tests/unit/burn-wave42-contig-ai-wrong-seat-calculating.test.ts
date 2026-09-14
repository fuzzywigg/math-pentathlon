/**
 * Wave 42 — Contig getAIPlacement null when calculating but wrong seat.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement, executeAITurn } from '../../src/games/contig-60/ai';

describe('Wave 42 Contig AI — wrong seat', () => {
  it('null placement for non-current player; executeAITurn identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [2, 2, 2] as [number, number, number],
      currentPlayer: 'player1' as const,
    };
    expect(getAIPlacement(state, 'player2', 'hard')).toBeNull();
    expect(executeAITurn(state, 'player2', 'hard')).toBe(state);
  });
});
