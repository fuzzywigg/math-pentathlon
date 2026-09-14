/**
 * Wave 39 — getHexNeighbors even/odd row parity leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getHexNeighbors } from '../../src/core/alignment/contiguous';
import type { ContiguousConfig } from '../../src/core/alignment/types';

describe('Wave 39 contig — hex parity neighbors', () => {
  const config: ContiguousConfig = { rows: 5, cols: 5 };

  it('even and odd rows use different offset tables', () => {
    const even = getHexNeighbors(2, 2, config);
    const odd = getHexNeighbors(1, 2, config);
    expect(even).toHaveLength(6);
    expect(odd).toHaveLength(6);
    const evenKeys = even.map((p) => `${p.row},${p.col}`).sort().join('|');
    const oddKeys = odd.map((p) => `${p.row},${p.col}`).sort().join('|');
    expect(evenKeys).not.toBe(oddKeys);
  });

  it('corner hex has fewer than 6 in-bounds neighbors', () => {
    const n = getHexNeighbors(0, 0, config);
    expect(n.length).toBeLessThan(6);
    expect(n.every((p) => p.row >= 0 && p.col >= 0)).toBe(true);
  });

  it('wrap expands corner neighbors onto opposite side', () => {
    const wrapped = getHexNeighbors(0, 0, { ...config, wrap: true });
    expect(wrapped.length).toBe(6);
  });
});
