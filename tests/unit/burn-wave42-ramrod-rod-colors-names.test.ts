/**
 * Wave 42 leftovers D — ramrod rod colors names. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { ROD_COLORS, ROD_NAMES } from '../../src/games/ramrod/types';

describe('Wave 42 ramrod — rod colors / names', () => {
  it('ROD_COLORS and ROD_NAMES keys 1-10 with unique names and hex colors', () => {
    const keys = Array.from({ length: 10 }, (_, i) => i + 1);
    expect(Object.keys(ROD_COLORS).map(Number).sort((a, b) => a - b)).toEqual(
      keys
    );
    expect(Object.keys(ROD_NAMES).map(Number).sort((a, b) => a - b)).toEqual(
      keys
    );

    const names = keys.map((k) => ROD_NAMES[k]);
    expect(new Set(names).size).toBe(10);

    for (const k of keys) {
      expect(ROD_COLORS[k]).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(ROD_NAMES[k].length).toBeGreaterThan(0);
    }
  });
});
