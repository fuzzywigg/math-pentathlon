/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr SOME_SUM size colors. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  SOME_SUM_ATTRIBUTES,
  getAttributeColor,
} from '../../src/core/attributes/types';

describe('Wave 56 attr — SOME_SUM size colors', () => {
  it('size colorMap small/medium/large leftover', () => {
    expect(getAttributeColor(SOME_SUM_ATTRIBUTES, 'size', 'small')).toBe('#4caf50');
    expect(getAttributeColor(SOME_SUM_ATTRIBUTES, 'size', 'medium')).toBe('#ff9800');
    expect(getAttributeColor(SOME_SUM_ATTRIBUTES, 'size', 'large')).toBe('#9c27b0');
  });
});
