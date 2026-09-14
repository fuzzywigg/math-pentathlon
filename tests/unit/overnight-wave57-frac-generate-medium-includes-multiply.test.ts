/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact medium generate includes multiply.
 * Wave55 whitelist allowed multiply but never asserted it appears. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 57 frac rules — medium includes multiply', () => {
  it('medium samples eventually include multiply leftover', () => {
    const ops = new Set<string>();
    for (let i = 0; i < 60; i++) {
      ops.add(generateProblem('medium', i + 1).operation);
    }
    expect(ops.has('multiply')).toBe(true);
    expect(ops.has('divide')).toBe(false);
  });
});
