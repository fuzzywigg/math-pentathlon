/**
 * Overnight TOKENMAXX — Stars getAIMove null leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { getAIMove } from '../../src/games/stars-bars/ai';

describe('Overnight stars — AI nulls', () => {
  it('wrong seat and gameOver return null', () => {
    const s = createInitialState();
    expect(getAIMove(s, 'player2', 'easy')).toBeNull();
    expect(getAIMove({ ...s, phase: 'gameOver' }, 'player1', 'medium')).toBeNull();
  });
});
