/**
 * Wave 44 overnight HEAVY — Fab AI null gates.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, isAITurn } from '../../src/games/fab-a-diffy/ai';

describe('Wave 44 fab AI — null gates', () => {
  it('wrong seat / gameOver / human mode', () => {
    const s = createInitialState();
    expect(getAIMove(s, 'player2', 'hard')).toBeNull();
    expect(getAIMove({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'easy')).toBeNull();
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
  });
});
