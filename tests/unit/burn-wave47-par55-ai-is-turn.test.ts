/**
 * Wave 47 leftover after #214/#215 — Par 55 isAITurn seat/mode leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import { isAITurn } from '../../src/games/par-55/ai';

describe('Wave 47 par deepen 6 — Wave 47 par55 — isAITurn', () => {
  it('true only for human-vs-ai when current seat matches aiPlayer', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('false for human-vs-human regardless of seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
  });

  it('false when aiPlayer is null or game is over', () => {
    const state = createInitialState();
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    const over = {
      ...state,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('tracks seat flip after hypothetical player2 turn', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(false);
  });
});
