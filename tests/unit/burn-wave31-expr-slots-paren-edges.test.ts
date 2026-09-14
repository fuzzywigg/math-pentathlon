/**
 * Wave 31 — expression slots parentheses edges + evaluate failure path.
 * Distinct from wave22 UI / wave27 slot smoke / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
} from '../../src/core/expressions';

describe('Wave 31 expr-slots — balanced parentheses', () => {
  it('accepts nested parens with mul outside', () => {
    const slots = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createParenCard(true)),
      createSlot(2, createNumberCard(2)),
      createSlot(3, createOperatorCard('+')),
      createSlot(4, createNumberCard(3)),
      createSlot(5, createParenCard(false)),
      createSlot(6, createOperatorCard('*')),
      createSlot(7, createNumberCard(4)),
      createSlot(8, createParenCard(false)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(20);
  });

  it('accepts paren around a single number', () => {
    const slots = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(9)),
      createSlot(2, createParenCard(false)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.result).toBe(9);
  });
});

describe('Wave 31 expr-slots — unmatched parentheses', () => {
  it('rejects extra closing paren', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createParenCard(false)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors).toContain('Unmatched closing parenthesis');
  });

  it('rejects unclosed opening paren', () => {
    const slots = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(1)),
      createSlot(2, createOperatorCard('+')),
      createSlot(3, createNumberCard(2)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors).toContain('Unmatched parentheses');
  });
});

describe('Wave 31 expr-slots — structurally valid but unevaluable', () => {
  it('marks canEvaluate false on division by zero while isValid true', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('/')),
      createSlot(2, createNumberCard(0)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(false);
    expect(v.errors.some((e) => /division by zero/i.test(e))).toBe(true);
  });
});
