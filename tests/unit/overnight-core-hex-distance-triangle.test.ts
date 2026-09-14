/**
 * Overnight TOKENMAXX — hexDistance triangle inequality + zero self.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { hexDistance, hexLine } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — distance triangle', () => {
  it('self distance 0; symmetry; triangle inequality samples', () => {
    const a = createAxial(0, 0);
    const b = createAxial(3, -1);
    const c = createAxial(-2, 4);
    expect(hexDistance(a, a)).toBe(0);
    expect(hexDistance(a, b)).toBe(hexDistance(b, a));
    expect(hexDistance(a, c)).toBeLessThanOrEqual(
      hexDistance(a, b) + hexDistance(b, c)
    );
    expect(hexLine(a, b)).toHaveLength(hexDistance(a, b) + 1);
  });
});
