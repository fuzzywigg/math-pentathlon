/**
 * Overnight TOKENMAXX — graph hex-lattice edge endpoints are hex distance 1.
 * Graph×hex handshake leftovers. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createHexLatticeGraph } from '../../src/core/graph/types';
import { hexDistance, parseCoordKey } from '../../src/core/hex';
import { getNeighbors, isConnected } from '../../src/core/graph/algorithms';

describe('Overnight core handshake — lattice ↔ hex distance', () => {
  it('every lattice edge connects axial neighbors at distance 1', () => {
    const g = createHexLatticeGraph(3);
    expect(isConnected(g)).toBe(true);
    for (const e of g.edges) {
      const a = parseCoordKey(e.from);
      const b = parseCoordKey(e.to);
      expect(hexDistance(a, b)).toBe(1);
    }
  });

  it('graph neighbors of center match hex ring radius 1 size', () => {
    const g = createHexLatticeGraph(2);
    expect(getNeighbors(g, '0,0')).toHaveLength(6);
  });
});
