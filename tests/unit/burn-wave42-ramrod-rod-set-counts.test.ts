/**
 * Wave 42 leftovers D — ramrod rod set counts. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createRodSet } from '../../src/games/ramrod/types';

describe('Wave 42 ramrod — rod set counts', () => {
  it('createRodSet length and per-length counts 8/6/5/4/4/3/3/2/2/2', () => {
    const rods = createRodSet();
    const expected: Record<number, number> = {
      1: 8,
      2: 6,
      3: 5,
      4: 4,
      5: 4,
      6: 3,
      7: 3,
      8: 2,
      9: 2,
      10: 2,
    };
    const total = Object.values(expected).reduce((a, b) => a + b, 0);
    expect(rods).toHaveLength(total);

    for (let length = 1; length <= 10; length++) {
      expect(rods.filter((r) => r.length === length)).toHaveLength(
        expected[length]
      );
    }
  });
});
