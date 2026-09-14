/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr BASIC triangle color. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  BASIC_ATTRIBUTES,
  getAttributeColor,
} from '../../src/core/attributes/types';

describe('Wave 56 attr — BASIC triangle color', () => {
  it('triangle shape colorMap leftover', () => {
    expect(getAttributeColor(BASIC_ATTRIBUTES, 'shape', 'triangle')).toBe('#4caf50');
  });
});
