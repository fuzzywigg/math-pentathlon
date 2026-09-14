/**
 * Wave 31 — expression deck factories + challenge catalog invariants.
 * Deepens types.ts factories beyond wave22 deck smoke. Distinct from storage (#151).
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
  solveTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 31 expr-deck — card factories isolation', () => {
  it('stamps unique ids by default and honors explicit ids', () => {
    const a = createNumberCard(5);
    const b = createNumberCard(5);
    expect(a.id).not.toBe(b.id);
    expect(a.value).toBe(5);
    expect(a.content).toBe('5');
    expect(a.tokenType).toBe('number');

    const op = createOperatorCard('*', 'my-op');
    expect(op.id).toBe('my-op');
    expect(op.operator).toBe('*');
    expect(op.tokenType).toBe('operator');

    const lp = createParenCard(true, 'L');
    const rp = createParenCard(false, 'R');
    expect(lp).toMatchObject({ id: 'L', content: '(', tokenType: 'lparen' });
    expect(rp).toMatchObject({ id: 'R', content: ')', tokenType: 'rparen' });
  });

  it('createSlot defaults card null and optional locked', () => {
    expect(createSlot(3)).toEqual({
      id: 'slot-3',
      index: 3,
      card: null,
      locked: undefined,
    });
    const locked = createSlot(0, createNumberCard(1, 'n1'), true);
    expect(locked.locked).toBe(true);
    expect(locked.card?.id).toBe('n1');
  });
});

describe('Wave 31 expr-deck — deck cardinality', () => {
  it('basic number/operator decks have expected sizes', () => {
    expect(createBasicNumberCards()).toHaveLength(9);
    expect(createBasicOperatorCards().map((c) => c.operator)).toEqual([
      '+',
      '-',
      '*',
      '/',
    ]);
  });

  it('createExpressionDeck respects options', () => {
    const full = createExpressionDeck();
    // default numbers 1..10 (10) + 4 ops + 2 parens = 16
    expect(full).toHaveLength(16);

    const custom = createExpressionDeck({
      numbers: [1, 2],
      operators: ['+'],
      includeParens: false,
    });
    expect(custom).toHaveLength(3);
    expect(custom.every((c) => c.tokenType !== 'lparen')).toBe(true);
  });
});

describe('Wave 31 expr-deck — challenge catalogs', () => {
  it('MAKE_TEN entries all target 10 with three numbers', () => {
    expect(MAKE_TEN_CHALLENGES.length).toBeGreaterThanOrEqual(5);
    for (const c of MAKE_TEN_CHALLENGES) {
      expect(c.target).toBe(10);
      expect(c.numbers).toHaveLength(3);
      expect(c.useAllNumbers).toBe(true);
      expect(c.useEachOnce).toBe(true);
    }
  });

  it('TWENTY_FOUR entries all target 24 with four numbers', () => {
    for (const c of TWENTY_FOUR_CHALLENGES) {
      expect(c.target).toBe(24);
      expect(c.numbers).toHaveLength(4);
    }
  });

  it('COUNTDOWN entries allow partial number use', () => {
    for (const c of COUNTDOWN_CHALLENGES) {
      expect(c.useAllNumbers).toBe(false);
      expect(c.numbers.length).toBeGreaterThanOrEqual(4);
      expect(c.target).toBeGreaterThan(100);
    }
  });

  it('createTargetChallenge option defaults', () => {
    const c = createTargetChallenge([1, 2], 3);
    expect(c.operators).toEqual(['+', '-', '*', '/']);
    expect(c.useAllNumbers).toBe(true);
    expect(c.useEachOnce).toBe(true);
  });
});

describe('Wave 31 expr-deck — catalog×solver handshake', () => {
  it('solveTargetChallenge returns exact for every MAKE_TEN entry', () => {
    for (const challenge of MAKE_TEN_CHALLENGES) {
      const sols = solveTargetChallenge(challenge, 25);
      expect(sols.some((s) => s.isExact)).toBe(true);
      for (const s of sols.filter((x) => x.isExact)) {
        expect(Math.abs(s.result - 10)).toBeLessThan(1e-4);
      }
    }
  });
});
