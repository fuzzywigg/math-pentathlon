/**
 * Wave 30 — validateSlots parenthesis depth / empty / nesting edges.
 * Deepens existing slot paren validation.
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

describe('Wave 30 expr-slots-paren — depth matching', () => {
  it('accepts nested balanced groups', () => {
    const nested = [
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
    const result = validateSlots(nested);
    expect(result.isValid).toBe(true);
    expect(result.result).toBe(20);
  });

  it('rejects unmatched openers and closers', () => {
    const openOnly = validateSlots([
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(1)),
    ]);
    expect(openOnly.isValid).toBe(false);
    expect(openOnly.errors.some((e) => /Unmatched parentheses/i.test(e))).toBe(
      true
    );

    const closeFirst = validateSlots([
      createSlot(0, createParenCard(false)),
      createSlot(1, createNumberCard(1)),
    ]);
    expect(closeFirst.isValid).toBe(false);
    expect(
      closeFirst.errors.some((e) => /Unmatched closing parenthesis/i.test(e))
    ).toBe(true);
  });
});

describe('Wave 30 expr-slots-paren — empty and op-adjacent', () => {
  it('rejects empty () groups via evaluation path when structurally marked', () => {
    const emptyPair = validateSlots([
      createSlot(0, createParenCard(true)),
      createSlot(1, createParenCard(false)),
    ]);
    // Structure: parenDepth returns to 0; lastWasOperator after '(' then ')' clears it.
    // If isValid, canEvaluate should still fail on empty group.
    if (emptyPair.isValid) {
      expect(emptyPair.canEvaluate).toBe(false);
    } else {
      expect(emptyPair.errors.length).toBeGreaterThan(0);
    }
  });

  it('allows number immediately after closing paren before next op', () => {
    // (1+2)*3 already covered; also (8)/2
    const slots = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(8)),
      createSlot(2, createParenCard(false)),
      createSlot(3, createOperatorCard('/')),
      createSlot(4, createNumberCard(2)),
    ];
    const result = validateSlots(slots);
    expect(result.isValid).toBe(true);
    expect(result.result).toBe(4);
  });
});
