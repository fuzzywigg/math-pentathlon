/**
 * Wave 22 — expression deck factories + challenge catalogs.
 * Distinct from expressions.test evaluator coverage and wave 21 attribute catalogs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
  createBasicNumberCards,
  createBasicOperatorCards,
  createExpressionDeck,
  createTargetChallenge,
  MAKE_TEN_CHALLENGES,
  TWENTY_FOUR_CHALLENGES,
  COUNTDOWN_CHALLENGES,
} from '../../src/core/expressions/types';

describe('Wave 22 expression-decks — card / slot factories', () => {
  it('number / operator / paren cards stamp tokenType + content', () => {
    const num = createNumberCard(7, 'n7');
    expect(num).toMatchObject({
      id: 'n7',
      content: '7',
      tokenType: 'number',
      value: 7,
    });

    const op = createOperatorCard('*', 'op-mul');
    expect(op).toMatchObject({
      id: 'op-mul',
      content: '*',
      tokenType: 'operator',
      operator: '*',
    });

    const lp = createParenCard(true, 'lp');
    const rp = createParenCard(false, 'rp');
    expect(lp.tokenType).toBe('lparen');
    expect(lp.content).toBe('(');
    expect(rp.tokenType).toBe('rparen');
    expect(rp.content).toBe(')');
  });

  it('createSlot fills defaults and optional locked card', () => {
    const empty = createSlot(2);
    expect(empty).toEqual({
      id: 'slot-2',
      index: 2,
      card: null,
      locked: undefined,
    });
    const filled = createSlot(0, createNumberCard(1, 'a'), true);
    expect(filled.card?.id).toBe('a');
    expect(filled.locked).toBe(true);
  });

  it('basic decks and custom createExpressionDeck cardinality', () => {
    const nums = createBasicNumberCards();
    expect(nums).toHaveLength(9);
    expect(nums.map((c) => c.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const ops = createBasicOperatorCards();
    expect(ops.map((c) => c.operator)).toEqual(['+', '-', '*', '/']);

    const custom = createExpressionDeck({
      numbers: [1, 2],
      operators: ['+'],
      includeParens: false,
    });
    expect(custom).toHaveLength(3);
    expect(custom.filter((c) => c.tokenType === 'number')).toHaveLength(2);
    expect(custom.filter((c) => c.tokenType === 'operator')).toHaveLength(1);

    const withParens = createExpressionDeck({
      numbers: [3],
      operators: ['-'],
      includeParens: true,
    });
    expect(withParens).toHaveLength(4);
    expect(withParens.some((c) => c.tokenType === 'lparen')).toBe(true);
    expect(withParens.some((c) => c.tokenType === 'rparen')).toBe(true);

    const defaults = createExpressionDeck();
    expect(defaults.filter((c) => c.tokenType === 'number')).toHaveLength(10);
    expect(defaults.filter((c) => c.tokenType === 'operator')).toHaveLength(4);
    expect(
      defaults.filter(
        (c) => c.tokenType === 'lparen' || c.tokenType === 'rparen'
      )
    ).toHaveLength(2);
  });
});

describe('Wave 22 expression-decks — challenge catalogs', () => {
  it('createTargetChallenge defaults and option overrides', () => {
    const base = createTargetChallenge([1, 2, 3], 6);
    expect(base.useAllNumbers).toBe(true);
    expect(base.useEachOnce).toBe(true);
    expect(base.operators).toEqual(['+', '-', '*', '/']);

    const loose = createTargetChallenge([25, 50], 100, {
      useAllNumbers: false,
      useEachOnce: false,
      operators: ['+', '*'],
    });
    expect(loose.useAllNumbers).toBe(false);
    expect(loose.useEachOnce).toBe(false);
    expect(loose.operators).toEqual(['+', '*']);
  });

  it('MAKE_TEN / TWENTY_FOUR / COUNTDOWN catalogs keep targets + flags', () => {
    expect(MAKE_TEN_CHALLENGES.length).toBeGreaterThanOrEqual(5);
    for (const c of MAKE_TEN_CHALLENGES) {
      expect(c.target).toBe(10);
      expect(c.numbers.length).toBeGreaterThan(0);
      expect(c.useAllNumbers).toBe(true);
      expect(c.useEachOnce).toBe(true);
    }

    expect(TWENTY_FOUR_CHALLENGES.length).toBeGreaterThanOrEqual(8);
    for (const c of TWENTY_FOUR_CHALLENGES) {
      expect(c.target).toBe(24);
      expect(c.numbers).toHaveLength(4);
      expect(c.useAllNumbers).toBe(true);
    }

    expect(COUNTDOWN_CHALLENGES.length).toBeGreaterThanOrEqual(3);
    for (const c of COUNTDOWN_CHALLENGES) {
      expect(c.useAllNumbers).toBe(false);
      expect(c.numbers.length).toBe(6);
      expect(c.target).toBeGreaterThan(100);
    }
  });
});
