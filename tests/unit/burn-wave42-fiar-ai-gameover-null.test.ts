/**
 * Wave 42 — FIAR AI null on gameOver (non-placement/movement).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

describe('Wave 42 FIAR AI — gameOver', () => {
  it('getAIMove null when phase is gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(state, 'player1', 'medium')).toBeNull();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
  });
});
