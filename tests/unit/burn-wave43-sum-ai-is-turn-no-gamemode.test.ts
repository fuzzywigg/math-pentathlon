/**
 * Wave 43 — Sum Dominoes isAITurn lacks gameMode leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { isAITurn } from '../../src/games/sum-dominoes/ai';

describe('Wave 43 sum-dominoes — isAITurn signature', () => {
  it('true for matching seat without gameMode; false null/gameOver', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player1')).toBe(true);
    expect(isAITurn(open, 'player2')).toBe(false);
    expect(isAITurn(open, null)).toBe(false);
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1')).toBe(false);
  });
});
