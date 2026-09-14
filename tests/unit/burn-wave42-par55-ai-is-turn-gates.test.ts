/** Wave 42 — Par 55 isAITurn gate matrix. Tests-only. */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import { isAITurn, getAIMove } from '../../src/games/par-55/ai';

describe('Wave 42 par55 — isAITurn gates', () => {
  it('human-vs-human always false', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
  });

  it('null aiPlayer → false even in human-vs-ai', () => {
    const state = createInitialState();
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
  });

  it('gameOver → false', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(over, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('true only when currentPlayer matches aiPlayer in hvai', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('getAIMove null when not AI seat (mirrors isAITurn)', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('flipped seat: ai player2 is turn after forge', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(false);
  });
});
