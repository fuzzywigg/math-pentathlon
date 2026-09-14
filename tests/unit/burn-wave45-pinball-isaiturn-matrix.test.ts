/**
 * Wave 45 TOKENMAXX — Pinball isAITurn answering-only matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';
import { isAITurn } from '../../src/games/fraction-pinball/ai';

describe('Wave 45 pinball — isAITurn matrix', () => {
  it('true only answering + matching seat', () => {
    const live = startGame(createInitialState());
    expect(isAITurn(live, 'player1')).toBe(true);
    expect(isAITurn(live, null)).toBe(false);
    expect(isAITurn(live, 'player2')).toBe(false);
    expect(isAITurn({ ...live, phase: 'showResult' }, 'player1')).toBe(false);
    expect(isAITurn({ ...live, phase: 'gameOver', winner: 'player1' }, 'player1')).toBe(false);
  });
});
