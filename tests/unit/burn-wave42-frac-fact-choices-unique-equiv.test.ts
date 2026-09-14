/** Wave 42 — Frac Fact 4 choices with one correct equivalent. Tests-only. */
import { describe, it, expect } from 'vitest';
import { generateProblem, checkAnswer } from '../../src/games/frac-fact/rules';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 42 Frac Fact — choices unique equiv', () => {
  it('always yields exactly four answerChoices', () => {
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const p = generateProblem(d, 1);
      expect(p.answerChoices).toHaveLength(4);
    }
  });

  it('exactly one choice is equivalent to correctAnswer', () => {
    for (let i = 0; i < 15; i++) {
      const p = generateProblem('medium', i + 1);
      const matches = p.answerChoices.filter((c) =>
        areEquivalent(c, p.correctAnswer)
      );
      expect(matches).toHaveLength(1);
      expect(checkAnswer(p, matches[0])).toBe(true);
    }
  });

  it('choices are pairwise non-equivalent (unique by value)', () => {
    for (let i = 0; i < 12; i++) {
      const p = generateProblem('easy', i + 1);
      for (let a = 0; a < p.answerChoices.length; a++) {
        for (let b = a + 1; b < p.answerChoices.length; b++) {
          expect(areEquivalent(p.answerChoices[a], p.answerChoices[b])).toBe(
            false
          );
        }
      }
    }
  });

  it('correctAnswer itself checks true via checkAnswer', () => {
    const p = generateProblem('hard', 9);
    expect(checkAnswer(p, p.correctAnswer)).toBe(true);
  });
});
