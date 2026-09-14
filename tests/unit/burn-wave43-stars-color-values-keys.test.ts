/**
 * Wave 43 — COLOR_VALUES covers COLORS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { COLOR_VALUES, COLORS } from '../../src/games/stars-bars/types';

describe('Wave 43 stars — color values', () => {
  it('COLOR_VALUES covers COLORS', () => {
    for (const c of COLORS) {
      expect(COLOR_VALUES[c]).toMatch(/^#/);
    }
  });
});
