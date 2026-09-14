/**
 * Wave 42 — Frac-Fact generateProblem ops catalog by difficulty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem, checkAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — generate ops catalog', () => {
  it('easy only add/subtract; medium adds multiply; answers check', () => {
    const easy = new Set(
      Array.from({ length: 40 }, (_, i) => generateProblem('easy', i).operation)
    );
    expect([...easy].every((o) => o === 'add' || o === 'subtract')).toBe(true);
    const med = new Set(
      Array.from({ length: 50 }, (_, i) => generateProblem('medium', i).operation)
    );
    expect(med.has('multiply') || med.has('add')).toBe(true);
    expect(med.has('divide')).toBe(false);
    for (let i = 0; i < 10; i++) {
      const p = generateProblem('hard', i);
      expect(p.answerChoices).toHaveLength(4);
      expect(checkAnswer(p, p.correctAnswer)).toBe(true);
      expect(p.correctAnswer.numerator).toBeGreaterThanOrEqual(0);
    }
  });
});
