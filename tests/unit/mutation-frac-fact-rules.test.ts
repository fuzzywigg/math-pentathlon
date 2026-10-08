/**
 * burn-1008-mp-mutation-audit — strengthen Frac Fact rules coverage
 * to kill surviving mutants (tests only; no engine source changes).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  generateProblem,
  startGame,
  checkAnswer,
  submitAnswer,
  nextProblem,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mutation/frac-fact – difficulty operand pools', () => {
  it('easy operands stay within denoms 1–4 and must exercise denom 4', () => {
    const dens = new Set<number>();
    const ops = new Set<string>();
    for (let n = 1; n <= 80; n++) {
      const p = generateProblem('easy', n);
      dens.add(p.operand1.denominator);
      dens.add(p.operand2.denominator);
      ops.add(p.operation);
      expect(p.operand1.denominator).toBeGreaterThanOrEqual(1);
      expect(p.operand1.denominator).toBeLessThanOrEqual(4);
      expect(p.operand2.denominator).toBeLessThanOrEqual(4);
      expect(['add', 'subtract']).toContain(p.operation);
      expect(p.operation === 'multiply' || p.operation === 'divide').toBe(false);
    }
    expect(dens.has(4)).toBe(true);
    expect(dens.has(2)).toBe(true);
    expect(ops.has('add') || ops.has('subtract')).toBe(true);
    expect(ops.has('multiply')).toBe(false);
    expect(ops.has('divide')).toBe(false);
  });

  it('medium allows denoms up to 8 (inclusive) and never divide; hard may divide', () => {
    const medDens = new Set<number>();
    const hardOps = new Set<string>();
    for (let n = 1; n <= 120; n++) {
      const med = generateProblem('medium', n);
      medDens.add(med.operand1.denominator);
      medDens.add(med.operand2.denominator);
      expect(med.operand1.denominator).toBeLessThanOrEqual(8);
      expect(med.operand2.denominator).toBeLessThanOrEqual(8);
      expect(med.operation).not.toBe('divide');
    }
    // medium filter is <= 8 — must exercise both mid-band and the inclusive bound
    expect(medDens.has(5)).toBe(true);
    expect(medDens.has(8)).toBe(true);
    expect(medDens.has(10)).toBe(false);

    for (let n = 1; n <= 80; n++) {
      hardOps.add(generateProblem('hard', n).operation);
    }
    expect(hardOps.has('divide') || hardOps.has('multiply')).toBe(true);
  });
});

describe('mutation/frac-fact – generateProblem structure', () => {
  it('answerChoices include the correct answer and enough distractors', () => {
    for (let n = 1; n <= 20; n++) {
      const p = generateProblem('easy', n);
      expect(p.id).toBe(`problem-${n}`);
      expect(p.answerChoices.length).toBeGreaterThanOrEqual(4);
      expect(
        p.answerChoices.some(
          (c) =>
            c.numerator === p.correctAnswer.numerator &&
            c.denominator === p.correctAnswer.denominator
        )
      ).toBe(true);
      // Distractors must not all equal the correct answer
      const wrongs = p.answerChoices.filter(
        (c) =>
          !(
            c.numerator === p.correctAnswer.numerator &&
            c.denominator === p.correctAnswer.denominator
          )
      );
      expect(wrongs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('subtract problems keep a non-negative result', () => {
    for (let n = 1; n <= 40; n++) {
      const p = generateProblem('easy', n);
      if (p.operation !== 'subtract') continue;
      const v1 = p.operand1.numerator / p.operand1.denominator;
      const v2 = p.operand2.numerator / p.operand2.denominator;
      expect(v1).toBeGreaterThanOrEqual(v2);
      expect(p.correctAnswer.numerator).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('mutation/frac-fact – distractors via controlled Math.random', () => {
  it('forced strategy indices still yield non-equivalent distractors', () => {
    // Drive randomFraction + strategy selection with a repeating sequence.
    let i = 0;
    const seq = [
      0.01, 0.02, 0.03, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.15, 0.25,
      0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 0.05, 0.12, 0.22, 0.32, 0.42,
      0.52, 0.62, 0.72, 0.82, 0.92,
    ];
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i % seq.length];
      i++;
      return v;
    });

    const p = generateProblem('medium', 7);
    expect(p.answerChoices).toHaveLength(4);
    for (const choice of p.answerChoices) {
      expect(choice.denominator).toBeGreaterThan(0);
      expect(Number.isFinite(choice.numerator)).toBe(true);
    }
    const correctKey = `${p.correctAnswer.numerator}/${p.correctAnswer.denominator}`;
    const keys = p.answerChoices.map((c) => `${c.numerator}/${c.denominator}`);
    expect(keys).toContain(correctKey);
    expect(new Set(keys).size).toBeGreaterThanOrEqual(2);
  });

  it('numerator+1 distractor strategy is reachable under mocked random', () => {
    // Force add, fixed operands via low random, then strategy index 0 a few times.
    // After that, vary random so fill-remaining / shuffle cannot hang.
    const values: number[] = [0, 0, 0]; // op add, operands 1/2 + 1/2
    for (let k = 0; k < 12; k++) values.push(0); // strategy 0 → numerator+1
    for (let k = 1; k <= 40; k++) values.push((k % 9) / 10);

    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = values[Math.min(i, values.length - 1)];
      i++;
      return v;
    });

    const p = generateProblem('easy', 3);
    expect(p.operation).toBe('add');
    const keys = p.answerChoices.map((c) => `${c.numerator}/${c.denominator}`);
    // correct 1/2+1/2 = 1/1; strategy0 → numerator+1 ⇒ 2/1
    expect(keys).toContain('1/1');
    expect(keys.some((k) => k === '2/1' || k === '2')).toBe(true);
  });

  it('double-denominator distractor strategy is reachable under mocked random', () => {
    const values: number[] = [0, 0, 0]; // add, 1/2 + 1/2
    // strategy index 3 of 6 ⇒ ~0.5..0.66 → use 0.55 for *2 denominator
    for (let k = 0; k < 12; k++) values.push(0.55);
    for (let k = 1; k <= 40; k++) values.push((k % 9) / 10);

    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = values[Math.min(i, values.length - 1)];
      i++;
      return v;
    });

    const p = generateProblem('easy', 4);
    const keys = p.answerChoices.map((c) => `${c.numerator}/${c.denominator}`);
    // correct 1/1; *2 denom on 1/1 → 1/2 (simplified) — must appear as a wrong choice
    expect(keys).toContain('1/1');
    expect(keys).toContain('1/2');
  });
});

describe('mutation/frac-fact – scoring / helpers still hold', () => {
  it('checkAnswer / submitAnswer / nextProblem phase gates', () => {
    const problem = generateProblem('easy', 1);
    expect(checkAnswer(problem, problem.correctAnswer)).toBe(true);
    expect(
      checkAnswer(problem, {
        numerator: problem.correctAnswer.numerator + 1,
        denominator: problem.correctAnswer.denominator,
      })
    ).toBe(false);

    const started = startGame(createInitialState('easy'));
    expect(started.phase).toBe('playing');
    expect(started.currentProblem).not.toBeNull();

    const wrong = submitAnswer(started, {
      numerator: 99,
      denominator: 100,
    });
    expect(wrong.phase).toBe('showingResult');
    expect(wrong.isCorrect).toBe(false);

    const advanced = nextProblem(wrong);
    expect(advanced.phase).toBe('playing');
    expect(advanced.currentProblem).not.toBeNull();
    expect(advanced.currentProblem!.id).not.toBe(wrong.currentProblem!.id);
  });

  it('formatFraction and getOperationSymbol stay stable', () => {
    expect(formatFraction({ numerator: 2, denominator: 1 })).toBe('2');
    expect(formatFraction({ numerator: 3, denominator: 5 })).toBe('3/5');
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
