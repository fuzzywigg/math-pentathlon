/**
 * Wave 34 — template factories × algorithm handshake stress.
 * Distinct from wave 27 topology-only and #158 graph-ui. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  bfs,
  isConnected,
  findComponents,
  findReachable,
  getNodeDegree,
  findAllPaths,
  createGridGraph,
  createCircularGraph,
  createStarGraph,
  createTrackGraph,
  createCompleteGraph,
  createHexLatticeGraph,
  type Graph,
} from '../../src/core/graph';

function assertConnectedTemplate(g: Graph): void {
  expect(isConnected(g)).toBe(true);
  expect(findComponents(g)).toHaveLength(1);
  const start = [...g.nodes.keys()][0];
  expect(findReachable(g, start).size).toBe(g.nodes.size);
  let degreeSum = 0;
  for (const id of g.nodes.keys()) degreeSum += getNodeDegree(g, id);
  expect(degreeSum).toBe(2 * g.edges.length);
}

describe('Wave 34 graph-template-handshake — algo × factories', () => {
  it('track / star / circular / grid / hex / complete stay connected', () => {
    assertConnectedTemplate(createTrackGraph(9));
    assertConnectedTemplate(createStarGraph(6));
    assertConnectedTemplate(createCircularGraph(7));
    assertConnectedTemplate(createGridGraph(4, 3));
    assertConnectedTemplate(createHexLatticeGraph(2));
    assertConnectedTemplate(createCompleteGraph(5));
  });

  it('bfs diameter samples match hop expectations', () => {
    expect(bfs(createTrackGraph(8), 't0', 't7').distance).toBe(7);
    expect(bfs(createStarGraph(5), 'n0', 'n4').distance).toBe(2);
    expect(bfs(createCircularGraph(10), 'n0', 'n5').distance).toBe(5);
    expect(bfs(createGridGraph(3, 3), '0-0', '2-2').distance).toBe(4);
    expect(bfs(createCompleteGraph(6), 'n0', 'n5').distance).toBe(1);
  });

  it('complete graph findAllPaths depth 2 is exactly the direct edge', () => {
    const g = createCompleteGraph(4);
    // maxDepth is node-count; direct edge path has length 2
    const paths = findAllPaths(g, 'n0', 'n2', 2);
    expect(paths).toHaveLength(1);
    expect(paths[0].nodes).toEqual(['n0', 'n2']);
    expect(findAllPaths(g, 'n0', 'n2', 1)).toEqual([]);
  });

  it('hex lattice ring0 is single node; ring1 adds 6', () => {
    expect(createHexLatticeGraph(0).nodes.size).toBe(1);
    expect(createHexLatticeGraph(1).nodes.size).toBe(7);
    assertConnectedTemplate(createHexLatticeGraph(1));
  });
});
