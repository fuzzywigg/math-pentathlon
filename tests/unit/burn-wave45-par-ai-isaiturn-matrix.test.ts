/**
 * Wave 45 — Par 55 isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { isAITurn } from '../../src/games/par-55/ai';

describe('Wave 45 par — isAITurn', () => {
  it('false for human-vs-human / null seat / gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('true when human-vs-ai and current matches seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });
});
