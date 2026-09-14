/**
 * Wave 43 — Ramrod executeAITurn passes when no placements. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/ramrod/rules';
import { executeAITurn, isAITurn, getAIMove } from '../../src/games/ramrod/ai';

describe('Wave 43 ramrod — AI pass when stuck', () => {
  it('empty hand → getAIMove null → executeAITurn flips seat', () => {
    const state = {
      ...createInitialState(),
      playerRods: { player1: [] as string[], player2: createInitialState().playerRods.player2 },
    };
    expect(hasValidMoves(state)).toBe(false);
    expect(getAIMove(state, 'player1', 'easy')).toBeNull();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
  });
});
