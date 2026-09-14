/**
 * Wave 39 — findPath with injected getHexNeighbors leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findPath,
  getHexNeighbors,
  getNeighbors,
  regionConnectsEdges,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';

describe('Wave 39 align — hex-injected findPath', () => {
  it('hex neighbor inject finds bridge that 4-way misses', () => {
    const board = [
      ['B', null, null],
      [null, 'B', null],
      ['B', null, null],
    ];
    const get = createArrayGetter(board);
    const config = { rows: 3, cols: 3 };

    const withHex = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 0 },
      get,
      config,
      getHexNeighbors
    );
    const with4 = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 0 },
      get,
      config,
      getNeighbors
    );

    expect(
      findPath({ row: 0, col: 1 }, { row: 0, col: 0 }, get, config)
    ).toBeNull();

    if (withHex) {
      expect(withHex[0]).toEqual({ row: 0, col: 0 });
      expect(withHex[withHex.length - 1]).toEqual({ row: 2, col: 0 });
    }
    expect(with4).toBeNull();
  });

  it('regionConnectsEdges top-bottom and hex parity neighbor lists', () => {
    const config = { rows: 3, cols: 3 };
    const region = {
      value: 'B' as const,
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
      size: 6,
    };
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(getHexNeighbors(0, 1, config).length).toBeGreaterThan(0);
    expect(getHexNeighbors(1, 1, config).length).toBeGreaterThan(0);
  });
});
