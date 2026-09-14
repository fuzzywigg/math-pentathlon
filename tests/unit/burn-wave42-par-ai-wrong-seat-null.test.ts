/**
 * Wave 42 — Par-55 AI wrong seat / gameOver null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove, isAITurn } from '../../src/games/par-55/ai';
import { createInitialState } from '../../src/games/par-55/rules';

describe('Wave 42 par-55 — AI gates', () => {
  it('wrong seat and gameOver yield null', () => {
    const s = createInitialState();
    expect(getAIMove(s, 'player2', 'medium')).toBeNull();
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    const over = { ...s, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
  });
});
