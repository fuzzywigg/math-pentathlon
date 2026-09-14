/**
 * Wave 45 TOKENMAXX — Queens getAIMove null on winner/wrong seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { getAIMove } from '../../src/games/queens-guards/ai';

describe('Wave 45 queens — AI null gates', () => {
  it('null when winner set or wrong seat', () => {
    const open = createInitialState();
    expect(getAIMove({ ...open, winner: 'player1' }, 'player1', 'hard')).toBeNull();
    expect(getAIMove(open, 'player2', 'hard')).toBeNull();
  });
});
