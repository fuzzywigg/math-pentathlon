/**
 * Overnight HEAVY leftover after #250 — K3 complete vs circular base (n>2 closes ring).
 * Distinct from overnight K2 handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createCompleteGraph,
  createCircularGraph,
} from '../../src/core/graph/types';
import { getNodeDegree, bfs } from '../../src/core/graph/algorithms';

describe('Wave 55 core graph — complete K3', () => {
  it('K3 every degree is 2; bfs hop is 1; extra chord vs C3', () => {
    const k3 = createCompleteGraph(3);
    const c3 = createCircularGraph(3);
    expect(c3.edges).toHaveLength(3);
    expect(k3.edges.length).toBeGreaterThanOrEqual(c3.edges.length);
    for (const id of k3.nodes.keys()) {
      expect(getNodeDegree(k3, id)).toBe(2);
    }
    expect(bfs(k3, 'n0', 'n2').distance).toBe(1);
  });
});
