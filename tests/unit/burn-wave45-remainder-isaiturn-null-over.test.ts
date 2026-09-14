/**
 * Wave 45 TOKENMAXX — Remainder isAITurn null/gameOver leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { isAITurn } from '../../src/games/remainder-islands/ai';

describe('Wave 45 remainder — isAITurn', () => {
  it('false for null ai and gameOver; true for matching seat', () => {
    const open = createInitialState();
    expect(isAITurn(open, null)).toBe(false);
    expect(isAITurn(open, 'player1')).toBe(true);
    expect(isAITurn(open, 'player2')).toBe(false);
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1')).toBe(false);
  });
});
