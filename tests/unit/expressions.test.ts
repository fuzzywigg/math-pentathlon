/**
 * Expression Evaluator Unit Tests
 * Covers src/core/expressions/evaluator.ts (#9)
 */

import { describe, it, expect } from 'vitest';
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

describe('tokenize', () => {
  it('tokenizes numbers and operators', () => {
    expect(tokenize('2+3*4')).toEqual([
      { type: 'number', value: 2 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 3 },
      { type: 'operator', value: '*' },
      { type: 'number', value: 4 },
    ]);
  });

  it('handles whitespace, decimals, and parentheses', () => {
    expect(tokenize('(1.5 + 2)')).toEqual([
      { type: 'lparen' },
      { type: 'number', value: 1.5 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 2 },
      { type: 'rparen' },
    ]);
  });

  it('maps unicode operators and compound inequalities', () => {
    expect(tokenize('3×4÷2')).toEqual([
      { type: 'number', value: 3 },
      { type: 'operator', value: '*' },
      { type: 'number', value: 4 },
      { type: 'operator', value: '/' },
      { type: 'number', value: 2 },
    ]);
    expect(tokenize('1<=2>=0')).toEqual([
      { type: 'number', value: 1 },
      { type: 'operator', value: '≤' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '≥' },
      { type: 'number', value: 0 },
    ]);
  });

  it('tokenizes variables', () => {
    expect(tokenize('x + y1')).toEqual([
      { type: 'variable', name: 'x' },
      { type: 'operator', value: '+' },
      { type: 'variable', name: 'y1' },
    ]);
  });
});

describe('parse + evaluateNode', () => {
  it('builds an AST and evaluates with precedence', () => {
    const ast = parse(tokenize('2+3*4'));
    expect(evaluateNode(ast)).toBe(14);
  });

  it('evaluates unary minus and variables', () => {
    const vars = new Map([['n', 5]]);
    expect(evaluateNode(parse(tokenize('-n')), vars)).toBe(-5);
  });

  it('throws on undefined variables and empty token stream', () => {
    expect(() => evaluateNode(parse(tokenize('x')))).toThrow(/Undefined variable/);
    expect(() => parse([])).toThrow(/Unexpected end/);
  });
});

describe('evaluate', () => {
  it('evaluates simple addition', () => {
    expect(evaluate('2+3')).toEqual({ success: true, value: 5 });
  });

  it('respects operator precedence', () => {
    expect(evaluate('2+3*4')).toEqual({ success: true, value: 14 });
  });

  it('handles parentheses', () => {
    expect(evaluate('(2+3)*4')).toEqual({ success: true, value: 20 });
  });

  it('handles division including non-integers', () => {
    const result = evaluate('10/3');
    expect(result.success).toBe(true);
    expect(result.value).toBeCloseTo(3.333, 2);
  });

  it('handles exponentiation and single-number expressions', () => {
    expect(evaluate('2^3')).toEqual({ success: true, value: 8 });
    expect(evaluate('42')).toEqual({ success: true, value: 42 });
  });

  it('rejects empty input', () => {
    expect(evaluate('')).toEqual({ success: false, error: 'Empty expression' });
    expect(evaluate('   ')).toEqual({ success: false, error: 'Empty expression' });
  });

  it('returns error for division by zero and unmatched parens', () => {
    expect(evaluate('1/0').success).toBe(false);
    expect(evaluate('(1+2').success).toBe(false);
  });

  it('evaluates with a variable map', () => {
    const vars = new Map([
      ['a', 3],
      ['b', 4],
    ]);
    expect(evaluate('a*b+1', vars)).toEqual({ success: true, value: 13 });
  });
});

describe('slotsToExpression + validateSlots', () => {
  it('joins filled slot contents', () => {
    const slots = [
      createSlot(0, createNumberCard(2)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(3)),
    ];
    expect(slotsToExpression(slots)).toBe('2 + 3');
  });

  it('accepts a valid evaluable slot sequence', () => {
    const slots = [
      createSlot(0, createNumberCard(2)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(3)),
    ];
    const result = validateSlots(slots);
    expect(result.isValid).toBe(true);
    expect(result.canEvaluate).toBe(true);
    expect(result.result).toBe(5);
  });

  it('rejects empty, consecutive operators, and unmatched parens', () => {
    expect(validateSlots([createSlot(0)]).errors).toContain('No cards placed');

    const consecutive = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createOperatorCard('*')),
      createSlot(3, createNumberCard(2)),
    ];
    expect(validateSlots(consecutive).isValid).toBe(false);

    const unmatched = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(1)),
    ];
    expect(validateSlots(unmatched).errors).toContain('Unmatched parentheses');
  });

  it('rejects expressions that start or end with an operator', () => {
    const startsWithOp = [
      createSlot(0, createOperatorCard('+')),
      createSlot(1, createNumberCard(1)),
    ];
    expect(validateSlots(startsWithOp).isValid).toBe(false);

    const endsWithOp = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('+')),
    ];
    expect(validateSlots(endsWithOp).isValid).toBe(false);
  });
});

describe('target challenge solving', () => {
  it('finds an exact solution for a small challenge', () => {
    const challenge = createTargetChallenge([1, 2, 3], 6, {
      operators: ['+', '*'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const solutions = solveTargetChallenge(challenge, 5);
    expect(solutions.length).toBeGreaterThan(0);
    expect(solutions.some((s) => s.isExact && Math.abs(s.result - 6) < 0.0001)).toBe(true);
  });

  it('validateSolution accepts exact matches and rejects wrong totals', () => {
    const challenge = createTargetChallenge([2, 3], 5, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('2 + 3', challenge).valid).toBe(true);
    expect(validateSolution('2 * 3', challenge).valid).toBe(false);
  });

  it('validateSolution enforces use-each-once and use-all-numbers', () => {
    const challenge = createTargetChallenge([2, 3, 4], 6, {
      operators: ['+', '*'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('2 + 2 + 2', challenge).valid).toBe(false);
    expect(validateSolution('2 * 3', challenge).valid).toBe(false);
  });
});

describe('equations', () => {
  it('parses and checks true/false equations', () => {
    const eq = parseEquation('2+2=4');
    expect(eq).not.toBeNull();
    expect(checkEquation(eq!).isTrue).toBe(true);
    expect(evaluateEquation('3*3=10').isTrue).toBe(false);
  });

  it('rejects invalid equation format', () => {
    expect(parseEquation('2+2')).toBeNull();
    expect(evaluateEquation('nope').error).toMatch(/Invalid equation/);
  });

  it('supports variables in equations', () => {
    const vars = new Map([['x', 4]]);
    expect(evaluateEquation('x/2=2', vars).isTrue).toBe(true);
  });
});

describe('formatting helpers', () => {
  it('formats numbers and AST strings', () => {
    expect(formatNumber(5)).toBe('5');
    expect(formatNumber(1.5)).toBe('1.5');
    expect(astToString(parse(tokenize('2+3')))).toBe('(2 + 3)');
  });

  it('simplifyExpression collapses evaluable expressions', () => {
    expect(simplifyExpression('2+2')).toBe('4');
    expect(simplifyExpression('(')).toBe('(');
  });
});
