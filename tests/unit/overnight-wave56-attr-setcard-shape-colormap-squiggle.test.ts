/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr SET shape colorMap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  SET_GAME_ATTRIBUTES,
  getAttributeColor,
} from '../../src/core/attributes/types';

describe('Wave 56 attr — SET shape colorMap', () => {
  it('squiggle/diamond shape colorMap leftover', () => {
    expect(getAttributeColor(SET_GAME_ATTRIBUTES, 'shape', 'squiggle')).toBe('#4caf50');
    expect(getAttributeColor(SET_GAME_ATTRIBUTES, 'shape', 'diamond')).toBe('#e91e63');
  });
});
