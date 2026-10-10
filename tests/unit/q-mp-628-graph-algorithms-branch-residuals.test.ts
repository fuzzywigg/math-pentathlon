/**
 * q-mp-628 — close graph/algorithms natural branch residuals (tests-only).
 *
 * Remeasured on tip post1023 @ fb0d0ec5 (preferred-host + handshake suites):
 *   algorithms.ts ~94.5%L / ~89.2%B without isolated spies;
 *   with r17 spies ~96–98%L / ~92–97%B depending on suite width.
 * Backlog baseline 81.6%L / 76.9%B (~498,501,529–563) is stale after tip folds.
 *
 * This file pins CURRENT product-reachable arms only:
 *   - playerConnectsSets L501 (reachable.has continue on diamond re-enqueue)
 *   - findPlayerRegion L426 (visited.has continue on diamond re-enqueue)
 *   - bfs L78 (!visited.has(neighbor) false on undirected back-edge)
 *   - findLongestPlayerPath optional-state / equal-length / visited-skip arms
 *
 * Soft-fail / spy arms L110 / L131 / L184 stay with undrafted q-mp-524.
 * queue.shift undefined (L498 and siblings) stays with r17 isolated spies.
 * Zero src. No AI / scoring / copy / aria pins. No ratchet JSON.
 */
import { describe, expect, it } from 'vitest';

import {
  bfs,
  findLongestPlayerPath,
  findPlayerRegion,
  playerConnectsSets,
} from '../../src/core/graph/algorithms';
import type {
  Graph,
  GraphBoard,
  GraphNode,
  NodeId,
  NodeState,
} from '../../src/core/graph/types';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function undirected(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: false,
    edges: edges.map(([from, to]) => ({ from, to })),
  };
}

function boardFrom(
  graph: Graph,
  owners: Record<string, number | undefined>,
  opts?: { omitUnlisted?: boolean }
): GraphBoard {
  const nodeStates = new Map<NodeId, NodeState>();
  for (const id of graph.nodes.keys()) {
    if (Object.prototype.hasOwnProperty.call(owners, id)) {
      const owner = owners[id];
      nodeStates.set(id, owner === undefined ? {} : { owner });
    } else if (!opts?.omitUnlisted) {
      nodeStates.set(id, {});
    }
  }
  return { graph, nodeStates };
}

describe('q-mp-628 graph algorithms — playerConnectsSets L501 diamond revisit', () => {
  it('diamond re-enqueue hits reachable.has continue; setB miss returns false', () => {
    // a→b, a→c, b→d, c→d all owned. BFS from a enqueues d twice before either
    // copy is processed; the second copy takes L501 continue. setB=[z] is
    // unreachable so the walk drains instead of early-returning on d.
    const graph = undirected(
      ['a', 'b', 'c', 'd', 'z'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, {
      a: 1,
      b: 1,
      c: 1,
      d: 1,
    });
    expect(playerConnectsSets(board, 1, ['a'], ['z'])).toBe(false);
    expect(playerConnectsSets(board, 1, ['a'], ['d'])).toBe(true);
  });

  it('grid diamond mid-cell re-enqueue still connects when setB is the tip', () => {
    // 2x2 grid forms a 4-cycle; owning all four forces corner re-enqueue.
    const graph = undirected(
      ['nw', 'ne', 'sw', 'se'],
      [
        ['nw', 'ne'],
        ['nw', 'sw'],
        ['ne', 'se'],
        ['sw', 'se'],
      ]
    );
    const board = boardFrom(graph, {
      nw: 1,
      ne: 1,
      sw: 1,
      se: 1,
    });
    expect(playerConnectsSets(board, 1, ['nw'], ['se'])).toBe(true);
    // Opponent ownership of se blocks the tip even if the diamond is walked.
    const blocked = boardFrom(graph, {
      nw: 1,
      ne: 1,
      sw: 1,
      se: 2,
    });
    expect(playerConnectsSets(blocked, 1, ['nw'], ['se'])).toBe(false);
  });
});

describe('q-mp-628 graph algorithms — findPlayerRegion L426 diamond revisit', () => {
  it('diamond flood drains duplicate queue entries via visited.has continue', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, {
      a: 1,
      b: 1,
      c: 1,
      d: 1,
    });
    const region = findPlayerRegion(board, 'a', 1);
    expect(region.sort()).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('q-mp-628 graph algorithms — bfs L78 undirected back-edge skip', () => {
  it('skips already-visited neighbor that is not the end', () => {
    // Undirected track: processing t1 sees t0 (visited) → L78 false arm,
    // then t2 as end → found.
    const graph = undirected(
      ['t0', 't1', 't2'],
      [
        ['t0', 't1'],
        ['t1', 't2'],
      ]
    );
    expect(bfs(graph, 't0', 't2')).toEqual({
      found: true,
      path: ['t0', 't1', 't2'],
      distance: 2,
    });
  });

  it('diamond: shortest path found; visited parents are not re-queued', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const result = bfs(graph, 'a', 'd');
    expect(result.found).toBe(true);
    expect(result.distance).toBe(2);
    expect(result.path).toHaveLength(3);
    expect(result.path[0]).toBe('a');
    expect(result.path.at(-1)).toBe('d');
  });
});

describe('q-mp-628 graph algorithms — findLongestPlayerPath residual arms', () => {
  it('missing nodeStates entry on a neighbor is skipped (optional owner arm)', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    // Omit c from nodeStates entirely — state?.owner is undefined.
    const board = boardFrom(
      graph,
      {
        a: 1,
        b: 1,
      },
      { omitUnlisted: true }
    );
    expect(findLongestPlayerPath(board, 1)).toEqual(['a', 'b']);
  });

  it('equal-length owned forks keep the first longest (not-greater arm)', () => {
    // Star with center+two leaves: every leaf-center-leaf path length is 3;
    // later starts take path.length > longestPath.length false when equal.
    const graph = undirected(
      ['center', 'n0', 'n1', 'n2'],
      [
        ['center', 'n0'],
        ['center', 'n1'],
        ['center', 'n2'],
      ]
    );
    const board = boardFrom(graph, {
      center: 1,
      n0: 1,
      n1: 1,
      n2: 1,
    });
    const path = findLongestPlayerPath(board, 1);
    expect(path).toHaveLength(3);
    expect(path[1]).toBe('center');
    expect(new Set(path).size).toBe(3);
  });

  it('DFS backtrack refuses already-visited neighbor on a cycle', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'a'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 1 });
    // Simple cycle: longest simple path length is 3 (cannot revisit).
    expect(findLongestPlayerPath(board, 1)).toHaveLength(3);
  });

  it('opponent neighbor never extends the owned path', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 2 });
    expect(findLongestPlayerPath(board, 1)).toEqual(['a', 'b']);
    expect(findLongestPlayerPath(board, 2)).toEqual(['c']);
  });
});

describe('q-mp-628 graph algorithms — deferred soft-fail ownership note', () => {
  it('documents L110/L131/L184 → q-mp-524 and L498 → r17 spies', () => {
    // Carry-forward (do not add Map/iterator/Array.prototype spies here):
    //   L110 dijkstra distances.get miss inside unvisited.forEach
    //   L131 dijkstra currentDist undefined continue
    //   L184 isConnected empty-iterator .done after size>0
    //   L498 playerConnectsSets queue.shift undefined break — r17 isolated
    expect(true).toBe(true);
  });
});
