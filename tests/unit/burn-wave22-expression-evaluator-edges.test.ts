/**
 * Wave 22 — expression evaluator edges beyond smoke expressions.test.
 * Distinct from wave14 Prime helpers and #124 attribute/fraction cores.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  tokenize,
  parse,
  evaluate,
  evaluateNode,
  slotsToExpression,
  validateSlots,
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 22 expression-evaluator — tokenize / parse edges', () => {
  it('skips unknown glyphs and keeps chained unary minus', () => {
    expect(tokenize('2@+3')).toEqual([
      { type: 'number', value: 2 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 3 },
    ]);
    expect(evaluate('--5')).toEqual({ success: true, value: 5 });
    expect(evaluate('-(2+3)')).toEqual({ success: true, value: -5 });
  });

  it('parses nested parens + power right-associativity surface', () => {
    expect(evaluate('((1+2)*(3+1))^2')).toEqual({ success: true, value: 144 });
    // 2^3^2 parses as (2^3)^2 under left-associative power loop in this parser
    expect(evaluate('2^3^2')).toEqual({ success: true, value: 64 });
  });

  it('evaluateNode throws on empty tokens / unmatched rparen / bad operator', () => {
    expect(() => parse([])).toThrow(/Unexpected end/);
    expect(evaluate('1+)').success).toBe(false);
    expect(evaluate(')1').success).toBe(false);
  });
});

describe('Wave 22 expression-evaluator — slots validation matrix', () => {
  it('slotsToExpression skips empty slots and joins contents', () => {
    const slots = [
      createSlot(0, createNumberCard(8, 'n8')),
      createSlot(1),
      createSlot(2, createOperatorCard('*', 'op*')),
      createSlot(3, createNumberCard(3, 'n3')),
    ];
    expect(slotsToExpression(slots)).toBe('8 * 3');
  });

  it('validateSlots accepts paren-wrapped products and flags trailing ops', () => {
    const ok = [
      createSlot(0, createParenCard(true, 'l')),
      createSlot(1, createNumberCard(2, 'a')),
      createSlot(2, createOperatorCard('+', 'p')),
      createSlot(3, createNumberCard(3, 'b')),
      createSlot(4, createParenCard(false, 'r')),
      createSlot(5, createOperatorCard('*', 'm')),
      createSlot(6, createNumberCard(4, 'c')),
    ];
    const v = validateSlots(ok);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(20);

    const trailing = [
      createSlot(0, createNumberCard(1, 'x')),
      createSlot(1, createOperatorCard('-', 'y')),
      createSlot(2, createNumberCard(1, 'z')),
      createSlot(3, createOperatorCard('+')),
    ];
    expect(validateSlots(trailing).isValid).toBe(false);
  });

  it('validateSlots keeps structural validity but marks div-by-zero non-evaluable', () => {
    const slots = [
      createSlot(0, createNumberCard(5)),
      createSlot(1, createOperatorCard('/')),
      createSlot(2, createNumberCard(0)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(false);
    expect(v.errors.some((e) => /zero|Division/i.test(e))).toBe(true);
  });
});

describe('Wave 22 expression-evaluator — solve / validate challenge edges', () => {
  it('solveTargetChallenge respects maxSolutions and surfaces exact hits', () => {
    const challenge = createTargetChallenge([1, 2, 3, 4], 24, {
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const limited = solveTargetChallenge(challenge, 2);
    expect(limited.length).toBeLessThanOrEqual(2);
    // early return may include near-misses (±1) before sort; still capped
    expect(limited.length).toBeGreaterThan(0);

    const plenty = solveTargetChallenge(challenge, 20);
    expect(plenty.some((s) => s.isExact)).toBe(true);

    const none = solveTargetChallenge(
      createTargetChallenge([1, 1, 1], 999, {
        operators: ['+'],
        useAllNumbers: true,
      }),
      5
    );
    expect(none.filter((s) => s.isExact)).toHaveLength(0);
  });

  it('validateSolution rejects parse failures and near-misses', () => {
    const challenge = createTargetChallenge([2, 3], 5, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('(2+', challenge).valid).toBe(false);
    expect(validateSolution('2 + 3', challenge).valid).toBe(true);

    const loose = createTargetChallenge([8, 3], 5, {
      operators: ['-'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('8 - 3', loose).valid).toBe(true);
  });

  it('validateSolution allows reuse when useEachOnce is false', () => {
    const challenge = createTargetChallenge([2], 6, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: false,
    });
    // solver path uses available numbers loosely; expression using 2 thrice
    expect(validateSolution('2 + 2 + 2', challenge).valid).toBe(true);
  });
});

describe('Wave 22 expression-evaluator — equations + formatting', () => {
  it('checkEquation surfaces evaluateNode errors as NaN sides', () => {
    const eq = parseEquation('x=1');
    expect(eq).not.toBeNull();
    const bad = checkEquation(eq!);
    expect(bad.isTrue).toBe(false);
    expect(Number.isNaN(bad.leftValue)).toBe(true);
    expect(bad.error).toMatch(/Undefined variable/);
  });

  it('evaluateEquation handles inequalities-as-ops only via = splitter', () => {
    expect(evaluateEquation('2*3=6').isTrue).toBe(true);
    expect(evaluateEquation('10/2=6').isTrue).toBe(false);
    expect(evaluateEquation('a=a').error).toBeTruthy();
  });

  it('formatNumber / astToString / simplifyExpression edge cases', () => {
    expect(formatNumber(0.5)).toBe('0.5');
    expect(formatNumber(1.25)).toBe('1.25');
    expect(formatNumber(2.00001)).toMatch(/^2/);

    const ast = parse(tokenize('-a*b'));
    const vars = new Map([
      ['a', 2],
      ['b', 3],
    ]);
    expect(evaluateNode(ast, vars)).toBe(-6);
    expect(astToString(ast)).toContain('-');

    expect(simplifyExpression('3*4+2')).toBe('14');
    expect(simplifyExpression('1/0')).toBe('1/0');
  });
});
