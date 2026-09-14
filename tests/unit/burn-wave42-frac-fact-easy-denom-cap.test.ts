/** Wave 42 — Frac Fact easy difficulty denominator cap. Tests-only. */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 42 Frac Fact — easy denom cap', () => {
  it('easy operands never exceed denominator 4', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem('easy', i + 1);
      expect(p.operand1.denominator).toBeLessThanOrEqual(4);
      expect(p.operand2.denominator).toBeLessThanOrEqual(4);
      expect(p.operand1.denominator).toBeGreaterThan(0);
      expect(p.operand2.denominator).toBeGreaterThan(0);
    }
  });

  it('easy ops stay within add/subtract', () => {
    for (let i = 0; i < 25; i++) {
      const p = generateProblem('easy', i + 1);
      expect(['add', 'subtract']).toContain(p.operation);
    }
  });

  it('medium can use denominators above the easy cap', () => {
    let sawAboveFour = false;
    for (let i = 0; i < 50; i++) {
      const p = generateProblem('medium', i + 1);
      if (p.operand1.denominator > 4 || p.operand2.denominator > 4) {
        sawAboveFour = true;
        break;
      }
    }
    expect(sawAboveFour).toBe(true);
  });

  it('easy problem still produces four choices and a valid id', () => {
    const p = generateProblem('easy', 42);
    expect(p.id).toBe('problem-42');
    expect(p.answerChoices).toHaveLength(4);
  });
});
