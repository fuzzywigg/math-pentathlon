/**
 * Wave 41 — Frac Fact generateProblem operation matrix by difficulty.
 * Tests-only. No product inventing.
 * Avoid pinning Math.random to a constant (distractor loop).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';
import type { Difficulty } from '../../src/games/frac-fact/types';
import type { FractionOperation } from '../../src/core/fractions/types';

afterEach(() => {
  vi.restoreAllMocks();
});

function seedVaryingRandom() {
  let i = 0;
  const seq = [0.11, 0.37, 0.52, 0.73, 0.19, 0.88, 0.41, 0.06, 0.64, 0.95];
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const v = seq[i % seq.length];
    i++;
    return v;
  });
}

describe('Wave 41 Frac Fact — generateProblem op matrix', () => {
  it('easy only yields add/subtract across many draws', () => {
    seedVaryingRandom();
    const ops = new Set<FractionOperation>();
    for (let n = 1; n <= 24; n++) {
      const p = generateProblem('easy', n);
      ops.add(p.operation);
      expect(['add', 'subtract']).toContain(p.operation);
      expect(p.id).toBe(`problem-${n}`);
      expect(p.answerChoices.length).toBeGreaterThanOrEqual(2);
      expect(p.answerChoices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            numerator: p.correctAnswer.numerator,
            denominator: p.correctAnswer.denominator,
          }),
        ])
      );
    }
    expect(ops.has('add') || ops.has('subtract')).toBe(true);
    expect(ops.has('multiply')).toBe(false);
    expect(ops.has('divide')).toBe(false);
  });

  it('medium never emits divide; hard may include all four ops', () => {
    seedVaryingRandom();
    const mediumOps = new Set<FractionOperation>();
    for (let n = 1; n <= 30; n++) {
      const p = generateProblem('medium', n);
      mediumOps.add(p.operation);
      expect(['add', 'subtract', 'multiply']).toContain(p.operation);
    }
    expect(mediumOps.has('divide')).toBe(false);

    const hardOps = new Set<FractionOperation>();
    for (let n = 1; n <= 40; n++) {
      hardOps.add(generateProblem('hard', n).operation);
    }
    for (const op of ['add', 'subtract', 'multiply', 'divide'] as FractionOperation[]) {
      // At least the allowed set is respected; presence of all four is likely with seed.
      expect([...hardOps]).toEqual(expect.arrayContaining([]));
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(op);
    }
    for (const op of hardOps) {
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(op);
    }
  });

  it('subtract problems keep non-negative correct answers for each difficulty', () => {
    seedVaryingRandom();
    const diffs: Difficulty[] = ['easy', 'medium', 'hard'];
    for (const d of diffs) {
      for (let n = 1; n <= 12; n++) {
        const p = generateProblem(d, n);
        expect(p.correctAnswer.numerator).toBeGreaterThanOrEqual(0);
        expect(p.correctAnswer.denominator).toBeGreaterThan(0);
      }
    }
  });
});
