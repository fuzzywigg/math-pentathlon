/**
 * Wave 42 — Prime Gold isAITurn leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isAITurn } from '../../src/games/prime-gold/ai';
import { createInitialState } from '../../src/games/prime-gold/rules';

describe('Wave 42 prime — isAITurn', () => {
  it('false for human-vs-human regardless of seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-human')).toBe(false);
  });

  it('false when aiPlayer is null or game is over', () => {
    const state = createInitialState();
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('true when human-vs-ai and current seat matches aiPlayer', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('tracks seat flip after passTurn-style currentPlayer change', () => {
    const p2Turn = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(isAITurn(p2Turn, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(p2Turn, 'player1', 'human-vs-ai')).toBe(false);
  });
});
