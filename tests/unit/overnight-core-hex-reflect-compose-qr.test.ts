/**
 * Overnight TOKENMAXX — reflect q then r composition; double reflect identity.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { reflect, hexEquals, axialToCube } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — reflect compose', () => {
  it('reflect twice on each axis is identity', () => {
    const samples = [
      createAxial(3, -1),
      createAxial(-2, 5),
      createAxial(0, 0),
      createAxial(1, -4),
    ];
    for (const h of samples) {
      for (const axis of ['q', 'r', 's'] as const) {
        expect(hexEquals(reflect(reflect(h, axis), axis), h)).toBe(true);
      }
    }
  });

  it('reflect preserves cube constraint x+y+z=0', () => {
    const h = createAxial(4, -7);
    for (const axis of ['q', 'r', 's'] as const) {
      const c = axialToCube(reflect(h, axis));
      expect(c.x + c.y + c.z).toBe(0);
    }
  });
});
