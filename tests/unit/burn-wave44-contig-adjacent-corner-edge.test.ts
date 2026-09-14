/**
 * Wave 44 — Contig adjacency corner/edge leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAdjacentPositions } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — adjacent corner/edge', () => {
  it('corner has 3, edge 5, interior 8', () => {
    expect(getAdjacentPositions(0, 0)).toHaveLength(3);
    expect(getAdjacentPositions(0, 4)).toHaveLength(5);
    expect(getAdjacentPositions(5, 9)).toHaveLength(3);
    expect(getAdjacentPositions(2, 4)).toHaveLength(8);
  });
});
