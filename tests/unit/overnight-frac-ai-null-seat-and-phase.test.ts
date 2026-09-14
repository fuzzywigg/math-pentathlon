/**
 * Overnight TOKENMAXX — Frac-Fact AI null/membership leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem } from '../../src/games/frac-fact/rules';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';

describe('Overnight frac-fact — AI gates', () => {
  it('isAITurn matrix; answer membership when playing', () => {
    const problem = generateProblem('medium', 1);
    const s = {
      ...createInitialState('medium'),
      currentProblem: problem,
      phase: 'playing' as const,
    };
    expect(isAITurn(s, null)).toBe(false);
    expect(isAITurn(s, 'player2')).toBe(false);
    expect(isAITurn(s, 'player1')).toBe(true);
    expect(isAITurn({ ...s, phase: 'showingResult' }, 'player1')).toBe(false);
    const ans = getAIAnswer(s, 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(
      problem.answerChoices.some(
        (c) => c.numerator === ans!.numerator && c.denominator === ans!.denominator
      )
    ).toBe(true);
    expect(getAIAnswer(s, 'player2', 'hard')).toBeNull();
  });
});
