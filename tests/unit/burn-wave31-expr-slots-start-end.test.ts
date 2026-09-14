/**
 * Wave 31 — slots start/end/unary-minus edge matrix deepen.
 * Distinct from wave22 UI / wave27 slot smoke / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  slotsToExpression,
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
} from '../../src/core/expressions';

describe('Wave 31 expr-slots — unary minus start evaluates', () => {
  it('leading minus operator card evaluates as negation', () => {
    const slots = [
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createNumberCard(8)),
    ];
    expect(slotsToExpression(slots)).toBe('- 8');
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(-8);
  });

  it('leading minus before paren group', () => {
    const slots = [
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createParenCard(true)),
      createSlot(2, createNumberCard(2)),
      createSlot(3, createOperatorCard('+')),
      createSlot(4, createNumberCard(3)),
      createSlot(5, createParenCard(false)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.result).toBe(-5);
  });
});

describe('Wave 31 expr-slots — operator start matrix', () => {
  it.each(['+', '*', '/', '^'] as const)(
    'rejects leading %s operator card',
    (op) => {
      const v = validateSlots([
        createSlot(0, createOperatorCard(op)),
        createSlot(1, createNumberCard(1)),
      ]);
      expect(v.isValid).toBe(false);
      expect(v.errors).toContain('Expression cannot start with an operator');
    }
  );
});

describe('Wave 31 expr-slots — operator end matrix', () => {
  it.each(['+', '-', '*', '/', '^'] as const)(
    'rejects trailing %s operator card',
    (op) => {
      const v = validateSlots([
        createSlot(0, createNumberCard(1)),
        createSlot(1, createOperatorCard(op)),
      ]);
      expect(v.isValid).toBe(false);
      expect(v.errors).toContain('Expression cannot end with an operator');
    }
  );
});

describe('Wave 31 expr-slots — locked card still participates', () => {
  it('locked number cards still join the expression string', () => {
    const slots = [
      createSlot(0, createNumberCard(4, 'a'), true),
      createSlot(1, createOperatorCard('*'), true),
      createSlot(2, createNumberCard(5, 'b'), false),
    ];
    expect(slotsToExpression(slots)).toBe('4 * 5');
    expect(validateSlots(slots).result).toBe(20);
  });
});
