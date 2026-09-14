/**
 * Wave 42 — Kings isAITurn mode / seat / gameOver gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isAITurn } from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — AI isAITurn modes', () => {
  it('human-vs-human always false', () => {
    const state = createInitialGameState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-human')).toBe(false);
  });

  it('human-vs-ai true only when seat matches currentPlayer', () => {
    const state = createInitialGameState();
    expect(state.currentPlayer).toBe('player1');
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    const p2 = { ...state, currentPlayer: 'player2' as const };
    expect(isAITurn(p2, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(p2, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('gameOver never AI turn even matching seat', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(over, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('placeQuadraphage / moveKing phases still allow AI when seat matches', () => {
    const placing = {
      ...createInitialGameState(),
      turnPhase: 'placeQuadraphage' as const,
    };
    expect(isAITurn(placing, 'player1', 'human-vs-ai')).toBe(true);
    const moving = {
      ...createInitialGameState(),
      turnPhase: 'moveKing' as const,
      currentPlayer: 'player2' as const,
    };
    expect(isAITurn(moving, 'player2', 'human-vs-ai')).toBe(true);
  });
});
