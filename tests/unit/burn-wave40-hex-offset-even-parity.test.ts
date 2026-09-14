/**
 * Wave 40 — hex offset even-parity leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  axialToOffset,
  offsetToAxial,
  hexEquals,
} from '../../src/core/hex';

describe('Wave 40 hex — offset even parity', () => {
  it('even parity roundtrips several axials', () => {
    for (const a of [
      createAxial(0, 0),
      createAxial(1, -1),
      createAxial(2, 3),
      createAxial(-2, 1),
    ]) {
      const off = axialToOffset(a, 'even');
      expect(hexEquals(offsetToAxial(off, 'even'), a)).toBe(true);
    }
  });

  it('even and odd parity differ for odd-q cells', () => {
    const a = createAxial(1, 0);
    const odd = axialToOffset(a, 'odd');
    const even = axialToOffset(a, 'even');
    expect(odd.col).toBe(even.col);
    expect(odd.row).not.toBe(even.row);
  });
});
