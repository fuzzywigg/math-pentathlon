/**
 * Wave 27 — connectivity / components / reachability (directed + undirected).
 * Distinct from contiguous region counts (#139/#141) and thin graph.test smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  isConnected,
  findComponents,
  findReachable,
  createGridGraph,
  createTrackGraph,
  createStarGraph,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

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

function directed(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return { ...undirected(nodes, edges), directed: true };
}

function sortedComponents(components: NodeId[][]): string[] {
  return components.map((c) => [...c].sort().join('|')).sort();
}

describe('Wave 27 graph-connectivity — isConnected', () => {
  it('empty graph is connected', () => {
    expect(isConnected({ nodes: new Map(), edges: [], directed: false })).toBe(
      true
    );
  });

  it('single node is connected', () => {
    expect(isConnected(undirected(['only'], []))).toBe(true);
  });

  it('path and grid templates are connected', () => {
    expect(isConnected(createTrackGraph(5))).toBe(true);
    expect(isConnected(createGridGraph(3, 4))).toBe(true);
    expect(isConnected(createStarGraph(6))).toBe(true);
  });

  it('detects two disjoint edges as disconnected', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['c', 'd'],
      ]
    );
    expect(isConnected(g)).toBe(false);
  });

  it('detects an isolate among an otherwise linked cluster', () => {
    const g = undirected(
      ['a', 'b', 'c', 'z'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(isConnected(g)).toBe(false);
  });

  it('directed ring may be weakly-but-not-checked: out-BFS from first may cover all', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'a'],
      ]
    );
    // Implementation BFS from first Map key — Map insertion order is a,b,c
    expect(isConnected(g)).toBe(true);
  });

  it('directed line is not fully reachable from the sink start key order', () => {
    // nodes inserted a,b,c — start at a can reach all
    const forward = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(isConnected(forward)).toBe(true);

    // If first key cannot reach all (c inserted first), reports disconnected
    const nodes = new Map<NodeId, GraphNode>([
      ['c', node('c')],
      ['a', node('a')],
      ['b', node('b')],
    ]);
    const reverseFirst: Graph = {
      nodes,
      directed: true,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
    };
    expect(isConnected(reverseFirst)).toBe(false);
  });
});

describe('Wave 27 graph-connectivity — findComponents', () => {
  it('one component for a connected graph', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const components = findComponents(g);
    expect(components).toHaveLength(1);
    expect(components[0].sort()).toEqual(['a', 'b', 'c']);
  });

  it('partitions disjoint clusters', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['c', 'd'],
      ]
    );
    const components = findComponents(g);
    expect(components).toHaveLength(3);
    expect(sortedComponents(components)).toEqual(['a|b', 'c|d', 'e']);
  });

  it('each isolate is its own component', () => {
    const g = undirected(['a', 'b', 'c'], []);
    expect(sortedComponents(findComponents(g))).toEqual(['a', 'b', 'c']);
  });

  it('empty graph yields no components', () => {
    expect(
      findComponents({ nodes: new Map(), edges: [], directed: false })
    ).toEqual([]);
  });

  it('grid is a single component covering all cells', () => {
    const grid = createGridGraph(2, 3);
    const components = findComponents(grid);
    expect(components).toHaveLength(1);
    expect(components[0]).toHaveLength(6);
  });

  it('removing a bridge splits a barbell into two components', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'], // bridge
        ['c', 'd'],
      ]
    );
    expect(findComponents(g)).toHaveLength(1);
    g.edges = g.edges.filter(
      (e) =>
        !(e.from === 'b' && e.to === 'c') && !(e.from === 'c' && e.to === 'b')
    );
    expect(sortedComponents(findComponents(g))).toEqual(['a|b', 'c|d']);
  });
});

describe('Wave 27 graph-connectivity — findReachable', () => {
  it('includes the start node always', () => {
    const g = undirected(['a'], []);
    expect([...findReachable(g, 'a')]).toEqual(['a']);
  });

  it('collects the entire connected component from start', () => {
    const g = undirected(
      ['a', 'b', 'c', 'z'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect([...findReachable(g, 'a')].sort()).toEqual(['a', 'b', 'c']);
    expect([...findReachable(g, 'z')]).toEqual(['z']);
  });

  it('respects directed out-reach only', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect([...findReachable(g, 'a')].sort()).toEqual(['a', 'b', 'c']);
    expect([...findReachable(g, 'b')].sort()).toEqual(['b', 'c']);
    expect([...findReachable(g, 'c')]).toEqual(['c']);
  });

  it('star center reaches all leaves; leaf only reaches center+self via undirected', () => {
    const star = createStarGraph(4);
    const fromCenter = findReachable(star, 'center');
    expect(fromCenter.size).toBe(5);
    const fromLeaf = findReachable(star, 'n0');
    expect(fromLeaf.size).toBe(5); // undirected
  });

  it('track endpoints reach the full chain', () => {
    const track = createTrackGraph(6);
    expect(findReachable(track, 't0').size).toBe(6);
    expect(findReachable(track, 't5').size).toBe(6);
  });

  it('unknown start yields only that id if somehow queued — no nodes means empty set path', () => {
    const g = undirected(['a'], []);
    // start not in graph: queue processes 'ghost', neighbors empty, reachable={ghost}
    expect([...findReachable(g, 'ghost')]).toEqual(['ghost']);
  });
});

describe('Wave 27 graph-connectivity — agreement matrix', () => {
  it('isConnected iff findComponents length is 0 or 1', () => {
    const cases: Graph[] = [
      undirected([], []),
      undirected(['a'], []),
      undirected(['a', 'b'], [['a', 'b']]),
      undirected(['a', 'b'], []),
      createGridGraph(2, 2),
      undirected(
        ['a', 'b', 'c', 'd'],
        [
          ['a', 'b'],
          ['c', 'd'],
        ]
      ),
    ];
    for (const g of cases) {
      const components = findComponents(g);
      const connected = isConnected(g);
      if (g.nodes.size === 0) {
        expect(connected).toBe(true);
        expect(components).toHaveLength(0);
      } else {
        expect(connected).toBe(components.length === 1);
      }
    }
  });

  it('reachable size equals component size containing start', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['d', 'e'],
      ]
    );
    const components = findComponents(g);
    for (const id of ['a', 'b', 'c', 'd', 'e'] as NodeId[]) {
      const comp = components.find((c) => c.includes(id))!;
      expect(findReachable(g, id).size).toBe(comp.length);
    }
  });
});
