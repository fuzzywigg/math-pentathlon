/** Wave 42 — Pinball isAITurn phase gates. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';
import { isAITurn } from '../../src/games/fraction-pinball/ai';

describe('Wave 42 Pinball — AI is turn phase', () => {
  it('true when answering and seat matches', () => {
    const state = startGame(createInitialState());
    expect(state.phase).toBe('answering');
    expect(isAITurn(state, 'player1')).toBe(true);
  });

  it('false for null aiPlayer', () => {
    const state = startGame(createInitialState());
    expect(isAITurn(state, null)).toBe(false);
  });

  it('false on showResult even if seat matches', () => {
    const state = {
      ...startGame(createInitialState()),
      phase: 'showResult' as const,
      currentPlayer: 'player1' as const,
    };
    expect(isAITurn(state, 'player1')).toBe(false);
  });

  it('false on gameOver', () => {
    const state = {
      ...startGame(createInitialState()),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(state, 'player1')).toBe(false);
  });

  it('false when answering but wrong seat', () => {
    const state = startGame(createInitialState());
    expect(state.currentPlayer).toBe('player1');
    expect(isAITurn(state, 'player2')).toBe(false);
  });

  it('true for player2 when answering is their seat', () => {
    const state = {
      ...startGame(createInitialState()),
      currentPlayer: 'player2' as const,
      phase: 'answering' as const,
    };
    expect(isAITurn(state, 'player2')).toBe(true);
  });
});
