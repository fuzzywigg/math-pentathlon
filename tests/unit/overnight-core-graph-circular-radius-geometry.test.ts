/**
 * Overnight TOKENMAXX — createCircularGraph radius geometry + ring close.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createCircularGraph } from '../../src/core/graph/types';
import { getNeighbors } from '../../src/core/graph/algorithms';

describe('Overnight core graph — circular radius geometry', () => {
  it('n=5 radius 50: nodes on circle; ring closes n4↔n0', () => {
    const g = createCircularGraph(5, 50);
    expect(g.edges).toHaveLength(5);
    for (const node of g.nodes.values()) {
      const r = Math.hypot(node.position.x, node.position.y);
      expect(r).toBeCloseTo(50, 5);
    }
    expect(getNeighbors(g, 'n0').sort()).toEqual(['n1', 'n4']);
  });
});
