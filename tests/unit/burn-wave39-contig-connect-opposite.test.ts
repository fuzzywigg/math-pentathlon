/**
 * Wave 39 — regionConnectsEdges opposite vs adjacent leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findRegion,
  regionConnectsEdges,
} from '../../src/core/alignment/contiguous';
import type { CellGetter, ContiguousConfig } from '../../src/core/alignment/types';

describe('Wave 39 contig — connects opposite edges', () => {
  const config: ContiguousConfig = { rows: 3, cols: 4 };

  it('full top-bottom column connects opposite vertical edges', () => {
    const board = [
      ['X', null, null, null],
      ['X', null, null, null],
      ['X', null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const region = findRegion(0, 0, get, config)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(false);
  });

  it('left-right row connects horizontal edges', () => {
    const board = [
      ['Y', 'Y', 'Y', 'Y'],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const region = findRegion(0, 0, get, config)!;
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(true);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(false);
  });

  it('L-shape connecting adjacent edges is not opposite', () => {
    const board = [
      ['Z', 'Z', null, null],
      ['Z', null, null, null],
      [null, null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const region = findRegion(0, 0, get, config)!;
    expect(regionConnectsEdges(region, 'top', 'left', config)).toBe(true);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(false);
  });
});
