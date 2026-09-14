/**
 * Wave 37 — directed overlay + distance rings on templates.
 * Beyond wave 34 directed/rings. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTrackGraph,
  createGridGraph,
  createStarGraph,
  createCircularGraph,
  findNodesAtDistance,
  findNodesWithinDistance,
  findReachable,
  bfs,
  getNeighbors,
  type Graph,
} from '../../src/core/graph';

function asDirected(g: Graph): Graph {
  return { ...g, directed: true, edges: g.edges.map((e) => ({ ...e })) };
}

describe('Wave 37 graph-directed — template overlays', () => {
  it('directed track only reaches forward nodes', () => {
    const g = asDirected(createTrackGraph(6));
    expect([...findReachable(g, 't2')].sort()).toEqual([
      't2',
      't3',
      't4',
      't5',
    ]);
    expect(bfs(g, 't5', 't0').found).toBe(false);
    expect(bfs(g, 't0', 't5').distance).toBe(5);
  });

  it('directed star from center reaches leaves; leaf cannot reach sibling', () => {
    const g = asDirected(createStarGraph(4));
    // edges are center→leaf in factory
    expect(getNeighbors(g, 'center').sort()).toEqual([
      'n0',
      'n1',
      'n2',
      'n3',
    ]);
    expect(getNeighbors(g, 'n0')).toEqual([]);
    expect(findReachable(g, 'center').size).toBe(5);
    expect(findReachable(g, 'n1').size).toBe(1);
  });

  it('directed circular is a one-way ring with distance n-1 around', () => {
    const g = asDirected(createCircularGraph(5));
    expect(bfs(g, 'n0', 'n4').distance).toBe(4);
    expect(findNodesAtDistance(g, 'n0', 2)).toEqual(['n2']);
    expect(findNodesWithinDistance(g, 'n0', 2).sort()).toEqual([
      'n0',
      'n1',
      'n2',
    ]);
  });

  it('directed grid only allows right/down movement', () => {
    const g = asDirected(createGridGraph(3, 3));
    expect(bfs(g, '0-0', '2-2').distance).toBe(4);
    expect(bfs(g, '2-2', '0-0').found).toBe(false);
    expect(findReachable(g, '1-1').has('0-0')).toBe(false);
    expect(findReachable(g, '1-1').has('2-2')).toBe(true);
  });
});

describe('Wave 37 graph-distance — dense template rings', () => {
  it('grid manhattan rings from corner match |dr|+|dc|', () => {
    const g = createGridGraph(4, 4);
    for (let d = 0; d <= 6; d++) {
      const ring = findNodesAtDistance(g, '0-0', d);
      for (const id of ring) {
        const [r, c] = id.split('-').map(Number);
        expect(r + c).toBe(d);
      }
    }
    expect(findNodesWithinDistance(g, '0-0', 2)).toHaveLength(6); // 1+2+3
  });

  it('undirected circular rings are symmetric for opposite nodes', () => {
    const g = createCircularGraph(8);
    expect(findNodesAtDistance(g, 'n0', 4).sort()).toEqual(['n4']);
    expect(findNodesAtDistance(g, 'n0', 1).sort()).toEqual(['n1', 'n7']);
    expect(findNodesWithinDistance(g, 'n0', 3)).toHaveLength(7);
  });
});
