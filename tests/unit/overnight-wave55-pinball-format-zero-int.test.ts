/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball formatDecimal 0 leftover.
 * Wave41 covered 0; pin this via game rules import only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatDecimal, formatFraction } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — format 0 leftover', () => {
  it('formats 0 as integer string leftover', () => {
    expect(formatDecimal(0)).toBe('0');
    expect(formatDecimal(4)).toBe('4');
    expect(formatFraction({ numerator: 0, denominator: 1 })).toBe('0');
  });
});
