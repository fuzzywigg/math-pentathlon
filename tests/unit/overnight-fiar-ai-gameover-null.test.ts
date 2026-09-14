/**
 * Overnight HEAVY — FIAR getAIMove null on gameOver (leftover gate).
 * Distinct from wave42 gameover null that forged via placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove } from '../../src/games/fiar/ai';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Overnight fiar — AI gameOver null', () => {
  it('returns null when phase is gameOver regardless of seat', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
    };
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
  });
});
