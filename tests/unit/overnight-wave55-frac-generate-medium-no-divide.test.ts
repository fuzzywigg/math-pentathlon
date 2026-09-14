/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact medium generate never divide.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — medium no divide', () => {
  it('medium problems stay add/subtract/multiply', () => {
    for (let i = 0; i < 24; i++) {
      const p = generateProblem('medium', i + 1);
      expect(['add', 'subtract', 'multiply']).toContain(p.operation);
      expect(p.operation).not.toBe('divide');
      expect(p.answerChoices.length).toBe(4);
    }
  });
});
