/**
 * Overnight HEAVY leftover after #234 — Frac Fact formatFraction negative improper.
 * Wave41 covered -2 whole and positive improper, not negative slash form. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatFraction } from '../../src/games/frac-fact/rules';

describe('Wave 52 frac — format neg improper', () => {
  it('keeps signed numerator with slash for -5/3', () => {
    expect(formatFraction({ numerator: -5, denominator: 3 })).toBe('-5/3');
  });
});
