/**
 * Wave 41 — Fraction Pinball generateChallenge / checkAnswer / AI leftovers.
 * Tests-only. Mock Math.random only after generateChallenge/startGame.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  generateChallenge,
  checkAnswer,
  startGame,
  formatDecimal,
  formatFraction,
} from '../../src/games/fraction-pinball/rules';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Pinball — generate check AI', () => {
  it('even challengeNumber → fractionToDecimal; odd → decimalToFraction', () => {
    const even = generateChallenge(2);
    expect(even.type).toBe('fractionToDecimal');
    expect(even.answerChoices).toHaveLength(4);
    expect(even.answerChoices).toContain(even.correctAnswer);

    const odd = generateChallenge(3);
    expect(odd.type).toBe('decimalToFraction');
    expect(odd.answerChoices).toContain(odd.correctAnswer);
  });

  it('checkAnswer is strict string equality', () => {
    const c = generateChallenge(1);
    expect(checkAnswer(c, c.correctAnswer)).toBe(true);
    expect(checkAnswer(c, c.correctAnswer + 'x')).toBe(false);
  });

  it('hard AI returns correctAnswer when accuracy hits', () => {
    const state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const ans = getAIAnswer(state, 'player1', 'hard');
    expect(ans).toBe(state.currentChallenge!.correctAnswer);
  });

  it('format helpers stay stable', () => {
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatFraction({ numerator: 1, denominator: 4 })).toBe('1/4');
  });
});
