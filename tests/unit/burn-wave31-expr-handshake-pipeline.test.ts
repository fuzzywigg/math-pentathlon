/**
 * Wave 31 — expression pipeline handshake (tokenize→parse→eval→format).
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  evaluateNode,
  evaluate,
  astToString,
  simplifyExpression,
  formatNumber,
  slotsToExpression,
  validateSlots,
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
  parseEquation,
  checkEquation,
} from '../../src/core/expressions';

describe('Wave 31 expr-handshake — string pipeline', () => {
  it.each(['1+2*3', '(4+5)*6', '2^3+1', '10/2/5', '-3*4'] as const)(
    'tokenize→parse→evaluateNode matches evaluate for %j',
    (src) => {
      const viaAst = evaluateNode(parse(tokenize(src)));
      const viaEval = evaluate(src);
      expect(viaEval.success).toBe(true);
      expect(viaAst).toBe(viaEval.value);
      expect(simplifyExpression(src)).toBe(formatNumber(viaAst));
    }
  );

  it('astToString output re-evaluates to the same value', () => {
    const src = '1+2*3-4';
    const printed = astToString(parse(tokenize(src)));
    // printed has extra parens but should evaluate identically
    expect(evaluate(printed)).toEqual(evaluate(src));
  });
});

describe('Wave 31 expr-handshake — slots ↔ string', () => {
  it('slot expression evaluates equal to hand-written string', () => {
    const slots = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(2)),
      createSlot(2, createOperatorCard('+')),
      createSlot(3, createNumberCard(3)),
      createSlot(4, createParenCard(false)),
      createSlot(5, createOperatorCard('*')),
      createSlot(6, createNumberCard(5)),
    ];
    const fromSlots = slotsToExpression(slots);
    expect(fromSlots).toBe('( 2 + 3 ) * 5');
    const validated = validateSlots(slots);
    expect(validated.result).toBe(25);
    expect(evaluate(fromSlots).value).toBe(25);
  });
});

describe('Wave 31 expr-handshake — equation vs dual evaluate', () => {
  it('equation truth matches comparing independent evaluates', () => {
    const left = '2+3*4';
    const right = '14';
    const eq = parseEquation(`${left}=${right}`);
    expect(checkEquation(eq!).isTrue).toBe(true);
    expect(evaluate(left).value).toBe(evaluate(right).value);
  });
});
