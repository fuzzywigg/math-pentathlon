/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact isAITurn null seat gate.
 * Wave55 covered gameOver null; null aiPlayer unasserted overnight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame } from '../../src/games/frac-fact/rules';
import { isAITurn } from '../../src/games/frac-fact/ai';

describe('Wave 57 frac AI — null seat', () => {
  it('isAITurn false when aiPlayer is null leftover', () => {
    const state = startGame(createInitialState('easy'));
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
  });
});
