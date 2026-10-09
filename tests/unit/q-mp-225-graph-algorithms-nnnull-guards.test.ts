/**
 * q-mp-225 — pin graph/algorithms edge contracts after clearing
 * @typescript-eslint/no-non-null-assertion (queue.shift / Map.get guards).
 * Behavior must stay identical to the pre-guard tip, including documented
 * dijkstra missing-end undefined-distance quirk.
 */
import { describe, it, expect } from 'vitest';
import {
  bfs,
  dijkstra,
  findComponents,
  findNodesAtDistance,
  findNodesWithinDistance,
  findPlayerRegion,
  findReachable,
  isConnected,
  playerConnectsSets,
} from '../../src/core/graph/algorithms';
import {
  createTrackGraph,
  type Graph,
  type GraphBoard,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph/types';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function undirected(
  nodes: NodeId[],
  edges: Array<[NodeId, NodeId, number?]>
): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: false,
    edges: edges.map(([from, to, weight]) => ({ from, to, weight })),
  };
}

describe('q-mp-225 graph algorithms nnnull guards', () => {
  it('bfs and dijkstra agree on a short weighted path; missing end keeps undefined distance', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 1],
        ['b', 'c', 1],
        ['a', 'c', 10],
      ]
    );
    expect(bfs(g, 'a', 'c')).toEqual({
      found: true,
      path: ['a', 'c'],
      distance: 1,
    });
    expect(dijkstra(g, 'a', 'c')).toEqual({
      found: true,
      path: ['a', 'b', 'c'],
      distance: 2,
    });

    const track = createTrackGraph(3);
    const missingEnd = dijkstra(track, 't0', 'ghost');
    expect(missingEnd.found).toBe(true);
    expect(missingEnd.path).toEqual(['ghost']);
    expect(missingEnd.distance).toBeUndefined();
    expect(dijkstra(track, 'ghost', 't0')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
  });

  it('connectivity / reachability / distance rings stay stable under shift guards', () => {
    const g = undirected(
      ['a', 'b', 'c', 'z'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(isConnected(g)).toBe(false);
    const components = findComponents(g).map((c) => [...c].sort());
    expect(components).toContainEqual(['a', 'b', 'c']);
    expect(components).toContainEqual(['z']);
    expect([...findReachable(g, 'a')].sort()).toEqual(['a', 'b', 'c']);
    expect(findNodesAtDistance(g, 'a', 2)).toEqual(['c']);
    expect(findNodesWithinDistance(g, 'a', 1).sort()).toEqual(['a', 'b']);
    // ghost start still seeds distance 0
    expect(findNodesWithinDistance(g, 'ghost', 2)).toEqual(['ghost']);
    expect(findNodesAtDistance(g, 'ghost', 0)).toEqual(['ghost']);
  });

  it('player region and connect-sets tolerate empty queues and foe blocks', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['a', { owner: 1 }],
        ['b', { owner: 1 }],
        ['c', { owner: 2 }],
      ]),
    };
    expect(findPlayerRegion(board, 'a', 1).sort()).toEqual(['a', 'b']);
    expect(findPlayerRegion(board, 'c', 1)).toEqual([]);
    expect(playerConnectsSets(board, 1, ['a'], ['b'])).toBe(true);
    expect(playerConnectsSets(board, 1, ['a'], ['c'])).toBe(false);
    expect(playerConnectsSets(board, 1, ['z'], ['a'])).toBe(false);
  });
});
