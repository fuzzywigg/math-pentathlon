/**
 * Overnight TOKENMAXX — Hex getNeighbors edge count leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getNeighbors } from '../../src/games/hex/rules';

describe('Overnight hex — neighbor counts', () => {
  it('center 6; mid-top edge fewer', () => {
    expect(getNeighbors({ row: 2, col: 2 }, 5)).toHaveLength(6);
    const edge = getNeighbors({ row: 0, col: 2 }, 5);
    expect(edge.length).toBeGreaterThanOrEqual(3);
    expect(edge.length).toBeLessThan(6);
  });
});
