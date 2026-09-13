/**
 * Wave 22 — expression types / decks / challenge catalogs.
 * Deepens factories unused by smoke expressions.test.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

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
  solveTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 22 expression-types — card / slot factories', () => {
  it('createNumberCard / Operator / Paren stamp token metadata', () => {
    const num = createNumberCard(7, 'fixed-num');
    expect(num).toMatchObject({
      id: 'fixed-num',
      content: '7',
      tokenType: 'number',
      value: 7,
    });

    const op = createOperatorCard('≤', 'fixed-op');
    expect(op.tokenType).toBe('operator');
    expect(op.operator).toBe('≤');
    expect(op.content).toBe('≤');

    const left = createParenCard(true, 'L');
    const right = createParenCard(false, 'R');
    expect(left).toMatchObject({ id: 'L', content: '(', tokenType: 'lparen' });
    expect(right).toMatchObject({
      id: 'R',
      content: ')',
      tokenType: 'rparen',
    });
  });

  it('createSlot defaults empty unlocked and accepts locked prefill', () => {
    const empty = createSlot(3);
    expect(empty).toEqual({
      id: 'slot-3',
      index: 3,
      card: null,
      locked: undefined,
    });

    const locked = createSlot(0, createNumberCard(1, 'n'), true);
    expect(locked.locked).toBe(true);
    expect(locked.card?.id).toBe('n');
  });

  it('auto-ids are unique across rapid factory calls', () => {
    const ids = new Set(
      Array.from({ length: 40 }, (_, i) =>
        i % 2 === 0 ? createNumberCard(i).id : createOperatorCard('+').id
      )
    );
    expect(ids.size).toBe(40);
  });
});

describe('Wave 22 expression-types — decks & basic packs', () => {
  it('createBasicNumberCards is 1–9; operators are + - * /', () => {
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

  it('createExpressionDeck defaults include 1–10, four ops, and parens', () => {
    const deck = createExpressionDeck();
    const numbers = deck.filter((c) => c.tokenType === 'number');
    const ops = deck.filter((c) => c.tokenType === 'operator');
    const parens = deck.filter(
      (c) => c.tokenType === 'lparen' || c.tokenType === 'rparen'
    );
    expect(numbers.map((c) => c.value)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(ops).toHaveLength(4);
    expect(parens).toHaveLength(2);
  });

  it('createExpressionDeck honors empty numbers, custom ops, no parens', () => {
    const deck = createExpressionDeck({
      numbers: [],
      operators: ['^', '='],
      includeParens: false,
    });
    expect(deck.every((c) => c.tokenType === 'operator')).toBe(true);
    expect(deck.map((c) => c.operator)).toEqual(['^', '=']);

    const onlyNums = createExpressionDeck({
      numbers: [100, 200],
      operators: [],
      includeParens: false,
    });
    expect(onlyNums.map((c) => c.value)).toEqual([100, 200]);
  });
});

describe('Wave 22 expression-types — challenge catalogs', () => {
  it('createTargetChallenge defaults useAllNumbers + useEachOnce', () => {
    const c = createTargetChallenge([1, 2], 3);
    expect(c).toEqual({
      numbers: [1, 2],
      target: 3,
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });
  });

  it('MAKE_TEN_CHALLENGES each have an exact solution under default ops', () => {
    for (const challenge of MAKE_TEN_CHALLENGES) {
      expect(challenge.target).toBe(10);
      const sols = solveTargetChallenge(challenge, 8);
      expect(sols.some((s) => s.isExact)).toBe(true);
      const exact = sols.find((s) => s.isExact)!;
      expect(validateSolution(exact.expression, challenge).valid).toBe(true);
    }
  });

  it('TWENTY_FOUR_CHALLENGES first entry solves to 24', () => {
    const challenge = TWENTY_FOUR_CHALLENGES[0];
    expect(challenge.numbers).toEqual([1, 2, 3, 4]);
    const sols = solveTargetChallenge(challenge, 5);
    expect(sols.some((s) => s.isExact && Math.abs(s.result - 24) < 1e-6)).toBe(
      true
    );
  });

  it('COUNTDOWN_CHALLENGES allow partial number use', () => {
    expect(COUNTDOWN_CHALLENGES.length).toBeGreaterThanOrEqual(3);
    for (const c of COUNTDOWN_CHALLENGES) {
      expect(c.useAllNumbers).toBe(false);
      expect(c.numbers.length).toBeGreaterThanOrEqual(4);
      expect(c.target).toBeGreaterThan(100);
    }
  });
});
