/**
 * Wave 39 — alignment hex neighbors / findPath / regionConnectsEdges leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getHexNeighbors,
  findPath,
  findRegion,
  regionConnectsEdges,
  regionTouchesEdge,
  countRegionsByValue,
} from '../../src/core/alignment/contiguous';

describe('Wave 39 alignment — hex path edges', () => {
  const config = { rows: 4, cols: 4 };

  it('getHexNeighbors returns up to 6 in-bounds', () => {
    const n = getHexNeighbors(2, 2, config);
    expect(n.length).toBeGreaterThan(0);
    expect(n.length).toBeLessThanOrEqual(6);
  });

  it('findPath on open same-value grid; null when disconnected', () => {
    const open = (r: number, c: number) =>
      r >= 0 && r < 4 && c >= 0 && c < 4 ? 1 : null;
    const path = findPath(
      { row: 0, col: 0 },
      { row: 3, col: 3 },
      open,
      config
    );
    expect(path).not.toBeNull();
    expect(path!.length).toBeGreaterThan(1);

    const blocked = (r: number, c: number) => {
      if (r === 0 && c === 0) return 1;
      if (r === 3 && c === 3) return 1;
      return null;
    };
    const noPath = findPath(
      { row: 0, col: 0 },
      { row: 3, col: 3 },
      blocked,
      config
    );
    expect(noPath).toBeNull();
  });

  it('region edge helpers', () => {
    const get = (r: number, c: number) =>
      r >= 0 && r < 3 && c >= 0 && c < 3 ? (c === 0 ? 1 : 0) : null;
    const region = findRegion(0, 0, get, { rows: 3, cols: 3 });
    expect(region).not.toBeNull();
    expect(regionTouchesEdge(region!, 'left', { rows: 3, cols: 3 })).toBe(
      true
    );
    expect(
      regionConnectsEdges(region!, 'left', 'right', { rows: 3, cols: 3 })
    ).toBe(false);
  });

  it('countRegionsByValue map', () => {
    const get = (r: number, c: number) => {
      if (r < 0 || r > 2 || c < 0 || c > 2) return null;
      if ((r === 0 && c === 0) || (r === 0 && c === 1)) return 'A';
      if (r === 2 && c === 2) return 'A';
      return null;
    };
    const counts = countRegionsByValue(get, { rows: 3, cols: 3 });
    expect(counts.get('A')).toBe(2);
  });
});
