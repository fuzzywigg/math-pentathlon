/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact hard generate includes divide.
 * Wave55 asserted medium never divides; overnight never forced hard÷. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 57 frac rules — hard includes divide', () => {
  it('hard samples eventually include divide leftover', () => {
    const ops = new Set<string>();
    for (let i = 0; i < 80; i++) {
      ops.add(generateProblem('hard', i + 1).operation);
    }
    expect(ops.has('divide')).toBe(true);
    expect(ops.has('add')).toBe(true);
  });
});
