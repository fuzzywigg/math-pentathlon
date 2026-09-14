/**
 * Wave 56 leftover after #256 — Ramrod ROD_NAMES exact 1–10 catalog.
 * Distinct from wave42 unique/truthy keys. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ROD_NAMES } from '../../src/games/ramrod/types';

describe('Wave 56 ramrod — rod names exact', () => {
  it('maps lengths 1–10 to Cuisenaire color names', () => {
    expect(ROD_NAMES).toEqual({
      1: 'White',
      2: 'Red',
      3: 'Light Green',
      4: 'Purple',
      5: 'Yellow',
      6: 'Dark Green',
      7: 'Black',
      8: 'Brown',
      9: 'Blue',
      10: 'Orange',
    });
  });
});
