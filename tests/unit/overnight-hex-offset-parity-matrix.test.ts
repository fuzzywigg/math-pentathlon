/**
 * Overnight TOKENMAXX — hex offset odd/even parity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { axialToOffset, offsetToAxial, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — offset parity roundtrips', () => {
  it('odd and even parity roundtrip for q,r in [-5,5]', () => {
    for (const parity of ['odd', 'even'] as const) {
      for (let q = -5; q <= 5; q++) {
        for (let r = -5; r <= 5; r++) {
          const a = createAxial(q, r);
          const off = axialToOffset(a, parity);
          expect(hexEquals(offsetToAxial(off, parity), a)).toBe(true);
        }
      }
    }
  });

  it('odd vs even row differ on odd columns', () => {
    const a = createAxial(3, 0);
    const odd = axialToOffset(a, 'odd');
    const even = axialToOffset(a, 'even');
    expect(odd.col).toBe(even.col);
    expect(odd.row).not.toBe(even.row);
  });
});
