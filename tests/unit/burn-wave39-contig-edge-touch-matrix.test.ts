/**
 * Wave 39 — regionTouchesEdge all-four + empty leftovers.
 * Beyond wave 25 connect. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { regionTouchesEdge } from '../../src/core/alignment/contiguous';
import type { ContiguousConfig, Region } from '../../src/core/alignment/types';

describe('Wave 39 contig — edge touch matrix', () => {
  const config: ContiguousConfig = { rows: 4, cols: 5 };

  function region(
    positions: { row: number; col: number }[],
    value: string = 'X'
  ): Region {
    return { value, positions, size: positions.length };
  }

  it('empty region touches no edges', () => {
    const r = region([]);
    expect(regionTouchesEdge(r, 'top', config)).toBe(false);
    expect(regionTouchesEdge(r, 'bottom', config)).toBe(false);
    expect(regionTouchesEdge(r, 'left', config)).toBe(false);
    expect(regionTouchesEdge(r, 'right', config)).toBe(false);
  });

  it('corner cell touches two edges', () => {
    const r = region([{ row: 0, col: 0 }]);
    expect(regionTouchesEdge(r, 'top', config)).toBe(true);
    expect(regionTouchesEdge(r, 'left', config)).toBe(true);
    expect(regionTouchesEdge(r, 'bottom', config)).toBe(false);
    expect(regionTouchesEdge(r, 'right', config)).toBe(false);
  });

  it('bottom-right corner touches bottom+right', () => {
    const r = region([{ row: 3, col: 4 }]);
    expect(regionTouchesEdge(r, 'bottom', config)).toBe(true);
    expect(regionTouchesEdge(r, 'right', config)).toBe(true);
  });

  it('interior cell touches none', () => {
    const r = region([{ row: 1, col: 2 }]);
    expect(regionTouchesEdge(r, 'top', config)).toBe(false);
    expect(regionTouchesEdge(r, 'bottom', config)).toBe(false);
    expect(regionTouchesEdge(r, 'left', config)).toBe(false);
    expect(regionTouchesEdge(r, 'right', config)).toBe(false);
  });
});
