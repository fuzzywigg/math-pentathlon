/**
 * Wave 30 — validateSlots / slotsToExpression start/end/consecutive/empty edges.
 * Deepens existing slot validation beyond wave 27 deepen.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  slotsToExpression,
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions';

describe('Wave 30 expr-slots — empty and join', () => {
  it('rejects all-empty and joins ignoring empty slots', () => {
    const empty = [createSlot(0), createSlot(1), createSlot(2)];
    const emptyResult = validateSlots(empty);
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.canEvaluate).toBe(false);
    expect(emptyResult.errors).toContain('No cards placed');
    expect(slotsToExpression(empty)).toBe('');

    const sparse = [
      createSlot(0, createNumberCard(4)),
      createSlot(1),
      createSlot(2, createOperatorCard('+')),
      createSlot(3),
      createSlot(4, createNumberCard(6)),
    ];
    expect(slotsToExpression(sparse)).toBe('4 + 6');
    expect(validateSlots(sparse).result).toBe(10);
  });
});

describe('Wave 30 expr-slots — operator placement rules', () => {
  it('rejects consecutive ops and trailing ops', () => {
    const consecutive = validateSlots([
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('*')),
      createSlot(2, createOperatorCard('+')),
      createSlot(3, createNumberCard(2)),
    ]);
    expect(consecutive.isValid).toBe(false);
    expect(consecutive.errors.some((e) => /Consecutive/i.test(e))).toBe(true);

    const trailing = validateSlots([
      createSlot(0, createNumberCard(8)),
      createSlot(1, createOperatorCard('/')),
    ]);
    expect(trailing.isValid).toBe(false);
    expect(trailing.errors.some((e) => /end with an operator/i.test(e))).toBe(
      true
    );
  });

  it('rejects non-minus leading operators; allows unary-minus lead', () => {
    for (const op of ['+', '*', '/'] as const) {
      const bad = validateSlots([
        createSlot(0, createOperatorCard(op)),
        createSlot(1, createNumberCard(3)),
      ]);
      expect(bad.isValid).toBe(false);
      expect(
        bad.errors.some((e) => /cannot start with an operator/i.test(e))
      ).toBe(true);
    }

    // Leading '-' is allowed by validateSlots; evaluate may still fail if
    // slotsToExpression inserts a space ("- 3") that parse treats as binary.
    const leadingMinus = validateSlots([
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createNumberCard(3)),
    ]);
    expect(leadingMinus.errors.some((e) => /cannot start/i.test(e))).toBe(
      false
    );
  });
});

describe('Wave 30 expr-slots — multi-digit evaluate path', () => {
  it('evaluates longer arithmetic chains when structurally valid', () => {
    const slots = [
      createSlot(0, createNumberCard(10)),
      createSlot(1, createOperatorCard('-')),
      createSlot(2, createNumberCard(2)),
      createSlot(3, createOperatorCard('*')),
      createSlot(4, createNumberCard(3)),
      createSlot(5, createOperatorCard('+')),
      createSlot(6, createNumberCard(1)),
    ];
    const result = validateSlots(slots);
    expect(result.isValid).toBe(true);
    expect(result.canEvaluate).toBe(true);
    expect(result.result).toBe(5); // 10 - 2*3 + 1
  });

  it('marks canEvaluate false when structure ok but eval fails (/0)', () => {
    const slots = [
      createSlot(0, createNumberCard(5)),
      createSlot(1, createOperatorCard('/')),
      createSlot(2, createNumberCard(0)),
    ];
    const result = validateSlots(slots);
    expect(result.isValid).toBe(true);
    expect(result.canEvaluate).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
