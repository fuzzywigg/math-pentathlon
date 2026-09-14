/**
 * Overnight TOKENMAXX — axialToOffset / offsetToAxial default parity is odd.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  axialToOffset,
  offsetToAxial,
  hexEquals,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — offset default odd', () => {
  it('omitted parity matches explicit odd across a disk', () => {
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        if (Math.abs(q + r) > 3) continue;
        const a = createAxial(q, r);
        expect(axialToOffset(a)).toEqual(axialToOffset(a, 'odd'));
        const off = axialToOffset(a);
        expect(hexEquals(offsetToAxial(off), a)).toBe(true);
        expect(hexEquals(offsetToAxial(off, 'odd'), a)).toBe(true);
      }
    }
  });

  it('even parity differs from odd on odd columns', () => {
    const a = createAxial(1, 0);
    expect(axialToOffset(a, 'odd')).not.toEqual(axialToOffset(a, 'even'));
    expect(
      hexEquals(
        offsetToAxial(axialToOffset(a, 'even'), 'even'),
        a
      )
    ).toBe(true);
  });
});
