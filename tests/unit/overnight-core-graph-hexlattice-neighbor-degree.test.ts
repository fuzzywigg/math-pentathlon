/**
 * Overnight TOKENMAXX — hex lattice interior degree 6; rim lower.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createHexLatticeGraph } from '../../src/core/graph/types';
import {
  getNodeDegree,
  isConnected,
  bfs,
} from '../../src/core/graph/algorithms';

describe('Overnight core graph — hex lattice degrees', () => {
  it('rings=2: center degree 6; connected; diameter-ish bfs', () => {
    const g = createHexLatticeGraph(2);
    expect(g.nodes.size).toBe(1 + 6 + 12); // 3r(r+1)+1 = 19
    expect(getNodeDegree(g, '0,0')).toBe(6);
    expect(isConnected(g)).toBe(true);
    expect(bfs(g, '0,0', '2,0').distance).toBe(2);
  });

  it('rings=1: 7 cells; outer cells degree < 6', () => {
    const g = createHexLatticeGraph(1);
    expect(g.nodes.size).toBe(7);
    const outerDegrees = [...g.nodes.keys()]
      .filter((id) => id !== '0,0')
      .map((id) => getNodeDegree(g, id));
    expect(outerDegrees.every((d) => d < 6)).toBe(true);
    expect(outerDegrees.every((d) => d >= 2)).toBe(true);
  });
});
