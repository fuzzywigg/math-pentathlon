/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact generateProblem easy denom gate.
 * Wave55 covered ops; denom ≤ 4 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 56 frac rules — easy denom gate', () => {
  it('easy operands keep denominators ≤ 4 leftover', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem('easy', i + 1);
      expect(p.operand1.denominator).toBeLessThanOrEqual(4);
      expect(p.operand2.denominator).toBeLessThanOrEqual(4);
      expect(['add', 'subtract']).toContain(p.operation);
    }
  });
});
