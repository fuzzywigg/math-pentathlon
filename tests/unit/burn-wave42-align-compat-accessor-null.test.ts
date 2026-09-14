/**
 * Wave 42 — createArrayAccessor OOB / null / undefined edges.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createArrayAccessor } from '../../src/core/alignment';

describe('Wave 42 align-compat — accessor null', () => {
  const grid = [
    [null, 'X'],
    ['Y', null],
  ];
  const get = createArrayAccessor(grid);

  it('returns stored null cells as null (not undefined)', () => {
    expect(get(0, 0)).toBeNull();
    expect(get(1, 1)).toBeNull();
  });

  it('returns in-bounds values', () => {
    expect(get(0, 1)).toBe('X');
    expect(get(1, 0)).toBe('Y');
  });

  it('row OOB → undefined', () => {
    expect(get(-1, 0)).toBeUndefined();
    expect(get(2, 0)).toBeUndefined();
  });

  it('col OOB → undefined', () => {
    expect(get(0, -1)).toBeUndefined();
    expect(get(0, 2)).toBeUndefined();
  });

  it('empty grid accessor always undefined', () => {
    const empty = createArrayAccessor([]);
    expect(empty(0, 0)).toBeUndefined();
  });
});
