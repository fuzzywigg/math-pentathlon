/**
 * Wave 44 — factory card/slot id leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
  createBasicNumberCards,
  createBasicOperatorCards,
} from '../../src/core/expressions';

describe('Wave 44 expr — factory card ids', () => {
  it('honors explicit ids and slot index', () => {
    expect(createNumberCard(7, 'n7').id).toBe('n7');
    expect(createOperatorCard('^', 'op-pow').id).toBe('op-pow');
    expect(createParenCard(true, 'lp').tokenType).toBe('lparen');
    expect(createParenCard(false, 'rp').tokenType).toBe('rparen');
    expect(createSlot(3).id).toBe('slot-3');
    expect(createSlot(1, createNumberCard(1), true).locked).toBe(true);
  });

  it('basic decks have expected sizes', () => {
    expect(createBasicNumberCards()).toHaveLength(9);
    expect(createBasicOperatorCards()).toHaveLength(4);
  });
});
