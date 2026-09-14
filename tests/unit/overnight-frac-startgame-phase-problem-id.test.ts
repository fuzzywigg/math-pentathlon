/**
 * Overnight TOKENMAXX — Frac-Fact startGame leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, checkAnswer } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — startGame', () => {
  it('playing phase with problem-1 and correct among choices', () => {
    const s = startGame(createInitialState('easy'));
    expect(s.phase).toBe('playing');
    expect(s.currentProblem?.id).toBe('problem-1');
    expect(s.currentProblem!.answerChoices).toHaveLength(4);
    expect(
      s.currentProblem!.answerChoices.some((c) =>
        checkAnswer(s.currentProblem!, c)
      )
    ).toBe(true);
  });
});
