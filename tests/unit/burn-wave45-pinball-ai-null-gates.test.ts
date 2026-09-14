/**
 * Wave 45 TOKENMAXX — Pinball getAIAnswer null gates leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';

describe('Wave 45 pinball — AI null gates', () => {
  it('null for wrong seat / showResult / no challenge', () => {
    const live = startGame(createInitialState());
    expect(getAIAnswer(live, 'player2', 'hard')).toBeNull();
    expect(
      getAIAnswer({ ...live, phase: 'showResult' }, 'player1', 'hard')
    ).toBeNull();
    expect(
      getAIAnswer({ ...live, currentChallenge: null }, 'player1', 'hard')
    ).toBeNull();
  });
});
