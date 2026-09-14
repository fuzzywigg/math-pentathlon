/**
 * Wave 43 TOKENMAXX — Fab AI null / seat gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, isAITurn } from '../../src/games/fab-a-diffy/ai';

describe('Wave 43 fab — AI null gates', () => {
  it('getAIMove null on wrong seat or gameOver', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2')).toBeNull();
    expect(getAIMove({ ...state, phase: 'gameOver', winner: 'player1' }, 'player1')).toBeNull();
  });

  it('isAITurn matrix', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });
});
