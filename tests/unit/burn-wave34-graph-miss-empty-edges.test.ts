/**
 * Wave 34 — missing-node / empty / self path edge contracts.
 * Deepens wave 27 miss cases across more APIs. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  bfs,
  dijkstra,
  getNeighbors,
  getEdge,
  areAdjacent,
  getNodeDegree,
  findAllPaths,
  findNodesAtDistance,
  findNodesWithinDistance,
  findReachable,
  findPlayerRegion,
  findLongestPlayerPath,
  playerConnectsSets,
  createTrackGraph,
  type Graph,
  type GraphBoard,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function emptyGraph(): Graph {
  return { nodes: new Map(), edges: [], directed: false };
}

describe('Wave 34 graph-miss-edges — ghosts / empty / self', () => {
  it('pathfinding to/from missing nodes documents API edges', () => {
    const g = createTrackGraph(3);
    // bfs: missing end ⇒ not-found
    expect(bfs(g, 't0', 'ghost')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
    expect(bfs(g, 'ghost', 't0').found).toBe(false);
    // start===end short-circuits even when id is absent
    expect(bfs(g, 'ghost', 'ghost')).toEqual({
      found: true,
      path: ['ghost'],
      distance: 0,
    });

    // dijkstra only initializes distances for nodes present in graph.nodes;
    // a missing end is not Infinity, so reconstruction yields a 1-node "path"
    const dMiss = dijkstra(g, 't0', 'ghost');
    expect(dMiss.found).toBe(true);
    expect(dMiss.path).toEqual(['ghost']);
    expect(dMiss.distance).toBeUndefined();
    expect(dijkstra(g, 'ghost', 't0').found).toBe(false);
    // dijkstra has no start===end short-circuit; missing start/end yields the same quirk
    const dSelf = dijkstra(g, 'ghost', 'ghost');
    expect(dSelf.found).toBe(true);
    expect(dSelf.path).toEqual(['ghost']);
    expect(dSelf.distance).toBeUndefined();
  });

  it('neighbor/edge/degree on missing ids are empty/undefined/0', () => {
    const g = createTrackGraph(2);
    expect(getNeighbors(g, 'nope')).toEqual([]);
    expect(getEdge(g, 'nope', 't0')).toBeUndefined();
    expect(areAdjacent(g, 't0', 'nope')).toBe(false);
    expect(getNodeDegree(g, 'nope')).toBe(0);
  });

  it('findAllPaths / distance helpers tolerate ghosts', () => {
    const g = createTrackGraph(3);
    expect(findAllPaths(g, 't0', 'ghost')).toEqual([]);
    expect(findNodesAtDistance(g, 'ghost', 1)).toEqual([]);
    // within-distance includes the start at dist 0 even if absent from graph
    expect(findNodesWithinDistance(g, 'ghost', 2)).toEqual(['ghost']);
    expect(findNodesAtDistance(g, 'ghost', 0)).toEqual(['ghost']);
    const r = findReachable(g, 'ghost');
    expect([...r]).toEqual(['ghost']);
  });

  it('empty graph pathfinding and components stay safe', () => {
    const g = emptyGraph();
    expect(bfs(g, 'a', 'b').found).toBe(false);
    expect(getNeighbors(g, 'a')).toEqual([]);
    expect(findReachable(g, 'a').size).toBeLessThanOrEqual(1);
  });

  it('self bfs is trivial found; player helpers on empty board', () => {
    const g = createTrackGraph(2);
    expect(bfs(g, 't0', 't0')).toEqual({
      found: true,
      path: ['t0'],
      distance: 0,
    });
    const board: GraphBoard = { graph: g, nodeStates: new Map() };
    expect(findPlayerRegion(board, 't0', 1)).toEqual([]);
    expect(findLongestPlayerPath(board, 1)).toEqual([]);
    expect(playerConnectsSets(board, 1, ['t0'], ['t1'])).toBe(false);
  });

  it('single-node undirected graph helpers', () => {
    const g: Graph = {
      nodes: new Map([['solo', node('solo')]]),
      edges: [],
      directed: false,
    };
    expect(bfs(g, 'solo', 'solo').found).toBe(true);
    expect(getNodeDegree(g, 'solo')).toBe(0);
    expect([...findReachable(g, 'solo')]).toEqual(['solo']);
    expect(findNodesAtDistance(g, 'solo', 0)).toEqual(['solo']);
    expect(findNodesWithinDistance(g, 'solo', 5)).toEqual(['solo']);
  });
});
