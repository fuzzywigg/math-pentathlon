/**
 * Overnight TOKENMAXX — createTrackGraph spacing places nodes on x-axis.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createTrackGraph } from '../../src/core/graph/types';
import { bfs, getNodeDegree } from '../../src/core/graph/algorithms';

describe('Overnight core graph — track spacing geometry', () => {
  it('custom spacing sets x = i*spacing; ends degree 1; mid degree 2', () => {
    const g = createTrackGraph(5, 25);
    for (let i = 0; i < 5; i++) {
      expect(g.nodes.get(`t${i}`)?.position).toEqual({ x: i * 25, y: 0 });
      expect(g.nodes.get(`t${i}`)?.label).toBe(String(i));
    }
    expect(getNodeDegree(g, 't0')).toBe(1);
    expect(getNodeDegree(g, 't2')).toBe(2);
    expect(getNodeDegree(g, 't4')).toBe(1);
    expect(bfs(g, 't0', 't4').distance).toBe(4);
  });
});
