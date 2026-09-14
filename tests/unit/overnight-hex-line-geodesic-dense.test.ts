/**
 * Overnight TOKENMAXX — hexLine geodesic density leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexLine, hexDistance, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — line geodesic', () => {
  it('line length is distance+1; endpoints preserved', () => {
    const pairs = [
      [createAxial(0, 0), createAxial(4, -2)],
      [createAxial(-3, 1), createAxial(2, 2)],
      [createAxial(5, -5), createAxial(-1, 0)],
    ];
    for (const [a, b] of pairs) {
      const line = hexLine(a, b);
      expect(line).toHaveLength(hexDistance(a, b) + 1);
      expect(hexEquals(line[0], a)).toBe(true);
      expect(hexEquals(line[line.length - 1], b)).toBe(true);
      for (let i = 1; i < line.length; i++) {
        expect(hexDistance(line[i - 1], line[i])).toBeLessThanOrEqual(1);
      }
    }
  });

  it('self-line is singleton', () => {
    const a = createAxial(1, 1);
    expect(hexLine(a, a)).toEqual([a]);
  });
});
