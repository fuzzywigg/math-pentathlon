/**
 * Wave 44 — slotsToExpression skips empty gap leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  slotsToExpression,
  createSlot,
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions';

describe('Wave 44 expr — slots empty gaps', () => {
  it('joins only filled cards with spaces', () => {
    const slots = [
      createSlot(0, createNumberCard(8)),
      createSlot(1),
      createSlot(2, createOperatorCard('+')),
      createSlot(3),
      createSlot(4, createNumberCard(1)),
    ];
    expect(slotsToExpression(slots)).toBe('8 + 1');
  });

  it('all-empty slots → empty string', () => {
    expect(slotsToExpression([createSlot(0), createSlot(1)])).toBe('');
  });
});
