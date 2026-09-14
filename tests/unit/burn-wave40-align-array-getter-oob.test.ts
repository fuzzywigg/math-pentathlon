/**
 * Wave 40 — createArrayGetter OOB leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createArrayGetter } from '../../src/core/alignment/grid-alignment';

describe('Wave 40 align core — array getter OOB', () => {
  const board = [
    [1, 2],
    [3, 4],
  ];
  const get = createArrayGetter(board);

  it('in-bounds returns cell; OOB returns null', () => {
    expect(get(0, 1)).toBe(2);
    expect(get(1, 0)).toBe(3);
    expect(get(-1, 0)).toBeNull();
    expect(get(0, 9)).toBeNull();
    expect(get(9, 0)).toBeNull();
  });
});
