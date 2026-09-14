/**
 * Wave 27 — expression evaluator solver / equation / slot / format edges.
 * Deepens beyond expressions.test.ts. Distinct from wave 22 UI + wave 26 success.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  evaluate,
  validateSlots,
  slotsToExpression,
  solveTargetChallenge,
  validateSolution,
  parseEquation,
  checkEquation,
  evaluateEquation,
  formatNumber,
  astToString,
  simplifyExpression,
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
  createTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 27 expressions — tokenize/parse edges', () => {
  it('rejects trailing operators and empty parens via evaluate', () => {
    expect(evaluate('2+').success).toBe(false);
    expect(evaluate('()').success).toBe(false);
    expect(evaluate('(2+3').success).toBe(false);
    expect(evaluate('2^3')).toEqual({ success: true, value: 8 });
  });

  it('astToString wraps binary/unary nodes; formatNumber trims decimals', () => {
    const tokens = tokenize('-2 + 3.5');
    const ast = parse(tokens);
    expect(astToString(ast)).toMatch(/-/);
    expect(formatNumber(2)).toBe('2');
    expect(formatNumber(1.5)).toMatch(/^1\.5/);
    expect(simplifyExpression('2+2')).toBe('4');
    expect(simplifyExpression('2+')).toBe('2+');
  });
});

describe('Wave 27 expressions — slots validation deepen', () => {
  it('validateSlots accepts multi-digit sequences and reports result', () => {
    const slots = [
      createSlot(0, createNumberCard(12)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(3)),
    ];
    expect(slotsToExpression(slots)).toBe('12 + 3');
    const result = validateSlots(slots);
    expect(result.isValid).toBe(true);
    expect(result.canEvaluate).toBe(true);
    expect(result.result).toBe(15);
  });

  it('accepts balanced parentheses and rejects unmatched / double ops', () => {
    const balanced = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(2)),
      createSlot(2, createOperatorCard('+')),
      createSlot(3, createNumberCard(3)),
      createSlot(4, createParenCard(false)),
      createSlot(5, createOperatorCard('*')),
      createSlot(6, createNumberCard(4)),
    ];
    const ok = validateSlots(balanced);
    expect(ok.isValid).toBe(true);
    expect(ok.result).toBe(20);

    expect(
      validateSlots([
        createSlot(0, createNumberCard(1)),
        createSlot(1, createOperatorCard('+')),
        createSlot(2, createOperatorCard('+')),
        createSlot(3, createNumberCard(2)),
      ]).isValid
    ).toBe(false);

    expect(
      validateSlots([
        createSlot(0, createParenCard(true)),
        createSlot(1, createNumberCard(1)),
      ]).isValid
    ).toBe(false);
  });
});

describe('Wave 27 expressions — target solver + validateSolution', () => {
  it('respects maxSolutions and finds exact matches', () => {
    const challenge = createTargetChallenge([1, 2, 3, 6], 6, {
      operators: ['+', '-', '*', '/'],
      useEachOnce: true,
      useAllNumbers: false,
    });
    const few = solveTargetChallenge(challenge, 2);
    expect(few.length).toBeLessThanOrEqual(2);
    expect(few.some((s) => s.isExact)).toBe(true);

    const many = solveTargetChallenge(challenge, 20);
    expect(many.length).toBeGreaterThanOrEqual(few.length);
  });

  it('validateSolution catches bad parse, wrong total, reuse, incomplete set', () => {
    const challenge = createTargetChallenge([2, 3, 4], 9, {
      operators: ['+', '-', '*', '/'],
      useEachOnce: true,
      useAllNumbers: true,
    });
    expect(validateSolution('2+', challenge).valid).toBe(false);
    expect(validateSolution('2+3', challenge).valid).toBe(false);
    expect(validateSolution('2+3+4', challenge).valid).toBe(true);
    expect(validateSolution('2+2+5', challenge).valid).toBe(false);

    const noReuse = createTargetChallenge([2, 3], 4, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('2+2', noReuse).valid).toBe(false);
  });

  it('near-miss solutions may appear when within tolerance of 1', () => {
    const challenge = createTargetChallenge([5, 5], 11, {
      operators: ['+', '-', '*', '/'],
      useEachOnce: true,
      useAllNumbers: true,
    });
    const sols = solveTargetChallenge(challenge, 10);
    expect(sols.some((s) => !s.isExact && Math.abs(s.result - 11) <= 1)).toBe(
      true
    );
  });
});

describe('Wave 27 expressions — equations', () => {
  it('parseEquation / checkEquation / evaluateEquation cover true false error', () => {
    const eq = parseEquation('2+2=4');
    expect(eq).not.toBeNull();
    expect(checkEquation(eq!).isTrue).toBe(true);

    expect(evaluateEquation('3*3=10').isTrue).toBe(false);
    expect(evaluateEquation('nope').error).toMatch(/invalid/i);

    const withVar = parseEquation('x+1=3');
    expect(checkEquation(withVar!, new Map([['x', 2]])).isTrue).toBe(true);
    expect(checkEquation(withVar!, new Map([['x', 0]])).isTrue).toBe(false);
  });

  it('missing variables surface as equation errors', () => {
    const eq = parseEquation('y=1');
    const result = checkEquation(eq!);
    expect(result.isTrue).toBe(false);
    expect(result.error || Number.isNaN(result.leftValue)).toBeTruthy();
  });
});
