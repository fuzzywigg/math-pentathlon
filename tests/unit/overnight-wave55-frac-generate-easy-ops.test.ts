/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact easy generate never multiply/divide.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — easy ops leftover', () => {
  it('easy problems stay add/subtract with 4 choices', () => {
    for (let i = 0; i < 24; i++) {
      const p = generateProblem('easy', i + 1);
      expect(['add', 'subtract']).toContain(p.operation);
      expect(p.answerChoices).toHaveLength(4);
      expect(p.id).toBe(`problem-${i + 1}`);
    }
  });
});
