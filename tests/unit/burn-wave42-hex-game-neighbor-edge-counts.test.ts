/**
 * Wave 42 — Hex game getNeighbors edge/corner/center counts.
 * Beyond wave41 center-6. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getNeighbors, isValidPosition } from '../../src/games/hex/rules';

describe('Wave 42 hex game — neighbor counts', () => {
  it('corner has fewer than edge; both under 6', () => {
    const size = 7;
    const corner = getNeighbors({ row: 0, col: 0 }, size);
    const topEdge = getNeighbors({ row: 0, col: 3 }, size);
    expect(corner.length).toBeLessThan(6);
    expect(topEdge.length).toBeLessThan(6);
    expect(topEdge.length).toBeGreaterThan(corner.length);
  });

  it('all neighbors are in-bounds unique offsets', () => {
    const size = 6;
    const mid = getNeighbors({ row: 2, col: 2 }, size);
    expect(mid).toHaveLength(6);
    const keys = mid.map((p) => `${p.row},${p.col}`);
    expect(new Set(keys).size).toBe(6);
    for (const n of mid) {
      expect(isValidPosition(n, size)).toBe(true);
    }
  });

  it('bottom-right corner neighbors stay on board', () => {
    const size = 5;
    const nbrs = getNeighbors({ row: 4, col: 4 }, size);
    expect(nbrs.length).toBeGreaterThan(0);
    expect(nbrs.every((n) => isValidPosition(n, size))).toBe(true);
  });
});
