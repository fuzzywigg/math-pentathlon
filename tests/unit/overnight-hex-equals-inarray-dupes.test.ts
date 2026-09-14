/**
 * Overnight TOKENMAXX — hexEquals / hexInArray leftover edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexEquals, hexInArray } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — equality helpers', () => {
  it('equals and membership', () => {
    const a = createAxial(1, 2);
    const b = createAxial(1, 2);
    const c = createAxial(2, 1);
    expect(hexEquals(a, b)).toBe(true);
    expect(hexEquals(a, c)).toBe(false);
    expect(hexInArray(a, [c, b])).toBe(true);
    expect(hexInArray(a, [c])).toBe(false);
  });
});
