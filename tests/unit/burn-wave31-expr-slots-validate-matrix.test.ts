/**
 * Wave 31 — expression slots validation matrix.
 * Distinct from wave22 decks/UI / wave27 slot smoke / storage (#151).
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

describe('Wave 31 expr-slots — happy paths', () => {
  it.each([
    {
      name: 'simple add',
      slots: [
        createSlot(0, createNumberCard(2)),
        createSlot(1, createOperatorCard('+')),
        createSlot(2, createNumberCard(5)),
      ],
      expr: '2 + 5',
      result: 7,
    },
    {
      name: 'mul precedence via evaluate',
      slots: [
        createSlot(0, createNumberCard(2)),
        createSlot(1, createOperatorCard('+')),
        createSlot(2, createNumberCard(3)),
        createSlot(3, createOperatorCard('*')),
        createSlot(4, createNumberCard(4)),
      ],
      expr: '2 + 3 * 4',
      result: 14,
    },
    {
      name: 'division',
      slots: [
        createSlot(0, createNumberCard(20)),
        createSlot(1, createOperatorCard('/')),
        createSlot(2, createNumberCard(4)),
      ],
      expr: '20 / 4',
      result: 5,
    },
  ])('$name evaluates', ({ slots, expr, result }) => {
    expect(slotsToExpression(slots)).toBe(expr);
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(result);
    expect(v.errors).toEqual([]);
  });
});

describe('Wave 31 expr-slots — empty / sparse', () => {
  it('rejects all-empty slots', () => {
    const v = validateSlots([createSlot(0), createSlot(1), createSlot(2)]);
    expect(v.isValid).toBe(false);
    expect(v.canEvaluate).toBe(false);
    expect(v.errors).toContain('No cards placed');
  });

  it('ignores empty holes between filled cards', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1),
      createSlot(2, createOperatorCard('+')),
      createSlot(3),
      createSlot(4, createNumberCard(2)),
    ];
    expect(slotsToExpression(slots)).toBe('1 + 2');
    expect(validateSlots(slots).result).toBe(3);
  });
});

describe('Wave 31 expr-slots — consecutive operators', () => {
  it('flags ++ and */ patterns', () => {
    const doubles = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createOperatorCard('+')),
      createSlot(3, createNumberCard(2)),
    ];
    expect(validateSlots(doubles).isValid).toBe(false);
    expect(validateSlots(doubles).errors).toContain(
      'Consecutive operators not allowed'
    );

    const mixed = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('*')),
      createSlot(2, createOperatorCard('/')),
      createSlot(3, createNumberCard(2)),
    ];
    expect(validateSlots(mixed).isValid).toBe(false);
  });
});

describe('Wave 31 expr-slots — start/end operator rules', () => {
  it('allows leading unary-minus operator card as start', () => {
    // first card operator '-' is allowed by validateSlots rule
    const slots = [
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createNumberCard(5)),
    ];
    const v = validateSlots(slots);
    // may be valid structurally; evaluation of "- 5" should work via tokenize
    expect(v.errors).not.toContain('Expression cannot start with an operator');
  });

  it('rejects leading + and trailing any operator', () => {
    expect(
      validateSlots([
        createSlot(0, createOperatorCard('+')),
        createSlot(1, createNumberCard(1)),
      ]).errors
    ).toContain('Expression cannot start with an operator');

    expect(
      validateSlots([
        createSlot(0, createNumberCard(1)),
        createSlot(1, createOperatorCard('+')),
      ]).errors
    ).toContain('Expression cannot end with an operator');
  });
});
