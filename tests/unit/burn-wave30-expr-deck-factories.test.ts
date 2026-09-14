/**
 * Wave 30 — expression deck / card / challenge factory contracts.
 * Deepens types.ts factories beyond wave 22 cardinality smoke.
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
  type Operator,
} from '../../src/core/expressions';

describe('Wave 30 expr-deck — card identity contracts', () => {
  it('stamps explicit ids and auto-ids when omitted', () => {
    const named = createNumberCard(42, 'answer');
    expect(named.id).toBe('answer');
    expect(named.value).toBe(42);

    const auto = createNumberCard(0);
    expect(auto.id).toMatch(/^num-0-/);
    expect(auto.content).toBe('0');

    const opAuto = createOperatorCard('^');
    expect(opAuto.id).toMatch(/^op-\^-/);
    expect(opAuto.operator).toBe('^');
    expect(opAuto.content).toBe('^');
  });

  it('paren cards flip tokenType with isLeft', () => {
    expect(createParenCard(true).tokenType).toBe('lparen');
    expect(createParenCard(false).tokenType).toBe('rparen');
  });
});

describe('Wave 30 expr-deck — deck composition matrix', () => {
  it('default deck is 10 nums + 4 ops + 2 parens', () => {
    const deck = createExpressionDeck();
    expect(deck.filter((c) => c.tokenType === 'number')).toHaveLength(10);
    expect(deck.filter((c) => c.tokenType === 'operator')).toHaveLength(4);
    expect(deck.filter((c) => c.tokenType === 'lparen')).toHaveLength(1);
    expect(deck.filter((c) => c.tokenType === 'rparen')).toHaveLength(1);
    expect(deck).toHaveLength(16);
  });

  it('honors custom numbers/operators/parens flags', () => {
    const ops: Operator[] = ['+', '*', '^'];
    const custom = createExpressionDeck({
      numbers: [7, 7, 11],
      operators: ops,
      includeParens: false,
    });
    expect(custom).toHaveLength(6);
    expect(custom.filter((c) => c.tokenType === 'number').map((c) => c.value)).toEqual([
      7, 7, 11,
    ]);
    expect(custom.map((c) => c.operator).filter(Boolean)).toEqual(ops);
    expect(custom.some((c) => c.tokenType === 'lparen')).toBe(false);
  });

  it('basic helpers stay fixed catalogs', () => {
    expect(createBasicNumberCards().map((c) => c.value)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(createBasicOperatorCards().map((c) => c.operator)).toEqual([
      '+',
      '-',
      '*',
      '/',
    ]);
  });
});

describe('Wave 30 expr-deck — challenge + slot defaults', () => {
  it('createTargetChallenge defaults useAllNumbers/useEachOnce true', () => {
    const c = createTargetChallenge([1, 2], 3);
    expect(c).toMatchObject({
      numbers: [1, 2],
      target: 3,
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });

    const partial = createTargetChallenge([1, 2, 3], 5, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: false,
    });
    expect(partial.operators).toEqual(['+']);
    expect(partial.useAllNumbers).toBe(false);
    expect(partial.useEachOnce).toBe(false);
  });

  it('createSlot indexes and optional lock', () => {
    expect(createSlot(5)).toEqual({
      id: 'slot-5',
      index: 5,
      card: null,
      locked: undefined,
    });
    const locked = createSlot(0, createNumberCard(9, 'n9'), true);
    expect(locked.locked).toBe(true);
    expect(locked.card?.id).toBe('n9');
  });
});
