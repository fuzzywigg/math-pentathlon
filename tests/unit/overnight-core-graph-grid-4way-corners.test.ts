/**
 * Overnight TOKENMAXX — createGridGraph corner/edge/interior degrees.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createGridGraph } from '../../src/core/graph/types';
import { getNodeDegree, bfs, isConnected } from '../../src/core/graph/algorithms';

describe('Overnight core graph — grid 4-way degrees', () => {
  it('3x4: corners deg2, edge deg3, interior deg4', () => {
    const g = createGridGraph(3, 4, 10);
    expect(g.nodes.size).toBe(12);
    expect(getNodeDegree(g, '0-0')).toBe(2);
    expect(getNodeDegree(g, '0-3')).toBe(2);
    expect(getNodeDegree(g, '2-0')).toBe(2);
    expect(getNodeDegree(g, '2-3')).toBe(2);
    expect(getNodeDegree(g, '0-1')).toBe(3);
    expect(getNodeDegree(g, '1-0')).toBe(3);
    expect(getNodeDegree(g, '1-1')).toBe(4);
    expect(isConnected(g)).toBe(true);
    expect(bfs(g, '0-0', '2-3').distance).toBe(5);
    expect(g.nodes.get('1-2')?.position).toEqual({ x: 20, y: 10 });
  });
});
