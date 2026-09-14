/**
 * Wave 43 — createRodSet counts / color catalog leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createRodSet, ROD_COLORS, ROD_NAMES } from '../../src/games/ramrod/types';

describe('Wave 43 ramrod — rodset counts', () => {
  it('createRodSet length matches catalog; colors/names 1..10', () => {
    const rods = createRodSet();
    expect(rods.length).toBe(8 + 6 + 5 + 4 + 4 + 3 + 3 + 2 + 2 + 2);
    for (let len = 1; len <= 10; len++) {
      expect(ROD_COLORS[len]).toBeTruthy();
      expect(ROD_NAMES[len]).toBeTruthy();
      expect(rods.filter((r) => r.length === len).length).toBeGreaterThan(0);
    }
  });
});
