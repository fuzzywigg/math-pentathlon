/**
 * Wave 40 — handshake hex range → align array getter → attr coprime leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  hexesInRange,
  hexDistance,
} from '../../src/core/hex';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import { areCoprime } from '../../src/core/attributes';

describe('Wave 40 handshake — hex → align → attr', () => {
  it('range size feeds getter board size; distance pairs may be coprime', () => {
    const center = createAxial(0, 0);
    const disk = hexesInRange(center, 1);
    expect(disk).toHaveLength(7);
    const n = disk.length;
    const board = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === c ? r : null))
    );
    const get = createArrayGetter(board);
    expect(get(0, 0)).toBe(0);
    expect(get(n, 0)).toBeNull();
    const d = hexDistance(disk[0], disk[3]);
    expect(typeof areCoprime(d + 1, n)).toBe('boolean');
  });
});
